const path = require('path');
const fs = require('fs');
const configRoot = path.resolve('/tmp/config.json');


// 读取用户本地有没有 /tmp/
export const isExist = () => fs.existsSync(configRoot);

// 获取配置信息
export const getConfig = () => JSON.parse(fs.readFileSync(configRoot, 'utf-8'));

// 写入配置文件
export const updateConfig = (data) => {
  fs.writeFileSync(configRoot, JSON.stringify(data), 'utf-8');
};

