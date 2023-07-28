module.exports = (program) => {
  // 1.自定义配置项 mycli -h
// program.option('-f, --framework', 'select a framework')
// program.option('-d, --dest <dest>', 'destination folder')
// 也支持链式调用
// program
//   .option('-f, --framework', 'select a framework')
//   .option('-d, --dest <dest>', 'destination folder')

  // const {program} = require("commander");
  const examples =  {
    create: ['mycli create <project-name>'],
    config: [
      'mycli config set <key> <value>',
      'mycli config get <key>',
    ]
  }


// 2.配置帮助信息处理逻辑
// commander自带的
  program.on('--help', () => {
    console.log('Examples:')
    Object.keys(examples).forEach(command => {
      examples[command].forEach(example => {
        console.log('  ' + example)
      })
    })
  })
// 自定义的需要添加 option:xxx(全称)
// program.on('option:framework', () => {
//   console.log('framework')
// })
// program.on('option:dest', () => {
//   console.log('dest')
// })
}

