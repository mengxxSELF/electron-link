const { exec } = require('child_process');
const path = require('path');
const shRoot = path.resolve('/tmp/run.sh');
const fs = require('fs');
const configRoot = path.resolve('/tmp/config.json');
const axios = require('axios');

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

// 检测 分组
export const get_groups = ({ group = '' }) => axios.get(`http://localhost:7758/electron/config?group=${group}`);

export const add_config = (content) => {
  axios({
    method: 'post',
    url: 'http://localhost:7758/electron/config',
    data: content,
  });
};

export const delete_config = (id) => {
  axios({
    method: 'get',
    url: `http://localhost:7758/electron/delete?id=${id}`,
  });
};

export const edit_config = (content) => {
  axios({
    method: 'post',
    url: 'http://localhost:7758/electron/edit',
    data: content,
  });
};

export const check_version = () => axios({
  method: 'get',
  url: 'http://localhost:7758/electron/version',
});
