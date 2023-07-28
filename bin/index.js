#! /usr/bin/env node
// 上面这行代码是给linux系统识别的 使用node运行这个文件

const {program} = require('commander'); // 控制台功能处理工具 https://www.npmjs.com/package/commander

const initHelper = require('../lib/core/help')
const initCommander = require('../lib/core/commander')

// 初始化配置
initHelper(program)
initCommander(program)

program.parse()

