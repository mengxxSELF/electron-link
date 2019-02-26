const { exec } = require('child_process');
const path = require('path');
const shRoot = path.resolve('/tmp/run.sh');
const fs = require('fs');
const configRoot = path.resolve('/tmp/config.json');
const urllib = require('urllib');

// 读取用户本地有没有 /tmp/
export const isExist = () => fs.existsSync(configRoot);

// 获取配置信息
export const getConfig = () => JSON.parse(fs.readFileSync(configRoot, 'utf-8'));

// 写入配置文件
export const updateConfig = (data) => {
  fs.writeFileSync(configRoot, JSON.stringify(data), 'utf-8');
};

// 链接服务器
export const linkServer = ({ type, address }) => {
  let server = '';
  if (type === 0) {
  // 0 redis
    server += 'redis-cli -h';
  } else {
  // 1 msyql
    server += 'ssh';
  }

  // 不用判断文件是否存在 直接重新写入
  const content = `#!/bin/bash \n  \n ${server} ${address}`;

  // 链接服务器
  fs.writeFileSync(shRoot, content);
  // 2 给脚本增加运行权限
  exec(`chmod +x ${shRoot}`, { silent: true });
  // 3 打开一个新的终端去执行这文件
  exec(`open -a Terminal  ${shRoot}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${typeof stderr}`);
  });
};

const prefix = 'localhost:7758/hd/';
// const prefix = 'http://6k.blued.cn/hd';

// 获取所有已有的共享数据
export const getGroups = async ({ group }) => {
  const url = `${prefix}/config?group=${group}`;
  const result = await urllib.requestThunk(url);
  console.log(result, 'result');
  return result;
};

// 写入到远程
export const addSystem = (data) => {
  //
  const url = `${prefix}/add`;
  const data2 = { };
  console.log('data2', data2, data, url);
  return 200;
};

// 删除远程

