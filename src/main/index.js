import { app, BrowserWindow, ipcMain, Menu } from 'electron'; // eslint-disable-line
import { checkNewVersion, getGroups } from './server'

const child_process = require('child_process')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

// 复制功能
const template = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
      {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'}
    ]
  }
]


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1800,
    webPreferences: {
      nodeIntegration: true,
      // webSecurity 设置可以处理跨域请求 不需要修改服务器 非常棒
      webSecurity: false
    },
  });


  mainWindow.webContents.openDevTools({ mode: 'left' });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 复制粘贴
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // child_process.spawn('node', ['server/index.js'])
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 版本
ipcMain.on('checkVersion', function version () {
  // console.log('检查版本 -- 检查版本 检查版本');
  // 进行版本检查 - 给server发送请求
  checkNewVersion().then(({data}) => {
    const {last, now} = data
    // console.log(data, 'result', last, now)
    const canUpdate = now > last
    mainWindow.webContents.send('version', canUpdate);
  })
  // event.sender.send('back', true);
  // mainWindow.webContents.send('back', false);
});


// 分组
ipcMain.on('getGroups', function version () {
  console.log('getGroup - -getGroup')
  // 进行版本检查 - 给server发送请求
  getGroups().then((data) => {
    console.log('检查版本 -- 检查版本 检查版本', data);
    
    // mainWindow.webContents.send('version', canUpdate);
  })
  // event.sender.send('back', true);
  // mainWindow.webContents.send('back', false);
});
