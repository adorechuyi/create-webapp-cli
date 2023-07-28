const createActionHandler = require('../actions/create')
const configActionHandler = require('../actions/config')
// 3.配置自定义命令
module.exports = program => {
  program
    .command('create <projectname> [others...]')  // 命令名
    .alias('c') // 简称
    .description('创建新的项目模版') // 描述
    .action(createActionHandler)

  program
    .command('config <set|get> [others...]')  // 命令名
    .alias('cfg') // 简称
    .description('配置信息处理') // 描述
    .action(configActionHandler)
}

