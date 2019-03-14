import urllib from 'urllib'

// 版本检测
export const checkNewVersion = () => {
  return urllib.request('http://www.webmxx.com/electron/version.js', {
    headers: {
      'Content-Type': 'application/json',
    },
    dataType: 'json'
  });
}

// 分组查询
export const getGroups = () => {
  return urllib.request('http://localhost:3890/electron/config', {
    headers: {
      'Content-Type': 'application/json',
    },
    dataType: 'json'
  });
}
