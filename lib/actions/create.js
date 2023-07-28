/**
 * @description 创建新的项目模版
 * @param name
 * @param args
 * @help
 * chalk@4 https://www.npmjs.com/package/chalk 控制台输出效果展示(注意版本区别v4 v5ESM) node环境不支持 commonJS
 * ora@5 下载插件  类似loading效果
 * inquirer@8 命令行交互 可以进行选择
 */
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')
const axios = require("axios");
const { parsePath } = require('../utils')
const path = require("path");
const fs = require("fs-extra");
const { promisify } = require('util') // node自带 promisify把回调改成async await
const downLoadRepo = promisify(require('download-git-repo'))
const ncp = promisify(require('ncp'))
const execa = require('execa')

module.exports = async (projectName, args) => {
  console.log('创建新的项目模版', projectName)
  // 1. 查询远程仓库模版信息 https://api.github.com/ 默认60次请求次数 添加token 可解决
  const result = await axios({
    method: 'get',
    url: 'https://api.github.com/users/adore-N/repos',
    headers: {
      Authorization: 'token ' + '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'
    }
  })
  // // 2. 筛选符合规则的仓库信息
  const { data } = result
  // 从接口返回处理
  const tempsName = data.reduce((prev, item) => {
    if(item.name.startsWith('create-')){
      prev.push(item.name)
    }
    return prev
  }, [])
  // mock
  // const tempsName = ['create-vue', 'create-react']


  // 3.提示用户进行选择
  const qList = [
    {
      type: 'list',
      message: '选择要使用的模版',
      name: 'template',
      choices: tempsName
    }
  ]
  const { template } =  await inquirer.prompt(qList)

  // 4.缓存路径处理 处理window mac的路径不同
  let cachePath = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] + '/.tmp'
  // 处理路径中的 \
  cachePath = parsePath(cachePath)
  // 路径处理，多个参数拼接为一个合法路径, 计算出项目要缓存的位置
  cachePath = path.resolve(cachePath, template)
  console.log('cachePath', cachePath)
  // 5.缓存检测
  if(!fs.existsSync(cachePath)){
    // 6.下载项目 download-git-repo
    const repo = 'adore-N/' + template
    const spinner = ora('正在执行下载.....').start()
    await downLoadRepo(repo, cachePath)
    spinner.succeed('下载完成')
  }
  // 9. 检测目标路径是否存在，如果存在，询问进行替换或取消
  const dest = `./${projectName}`
  if(fs.existsSync(dest)) {
    const { isReplace } = await inquirer.prompt([
      {
        type: 'confirm',
        message: '目标目录已存在，是否替换？',
        name: 'isReplace'
      }
    ])
    // 获取选择结果
    if(!isReplace) {
      console.log(chalk.red.bold('目标路径已存在，取消操作'));
      return
    }
    // 移除已存在的目录
    await fs.remove(dest);
  }

  // 7.初始化项目（将下载的项目模版拷贝到当前工作目录下）
  await ncp(cachePath, projectName)

  // 8.安装依赖 npm install
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const spinner = ora('正在安装依赖.....').start()
  const {stdout, stderr} = await execa(npm, ['install'], { cwd: './' + projectName} )
  spinner.succeed('依赖安装完成')

  console.log(cachePath)
  console.log('template', template)

}
