// 开启一个子线程，执行一些功能 child_process
const { execFile } = require('child_process')

// 终端处理 有兼容问题
exports.commandExec = (...args) => {
  return new Promise((resolve, reject) => {
    const childProcess =  execFile(...args);
    // 将子进程的一些状态告知给主进程
    childProcess.stdout.pipe(process.stdout)
    childProcess.stdout.pipe(process.stderr)
    // 当子进程执行完毕时 调用promise的resolve的状态
    childProcess.on('close', () => {
      resolve()
    })

  })
}
