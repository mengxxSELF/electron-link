# vvbuild

> An electron-vue project

![img](https://user-gold-cdn.xitu.io/2019/1/31/168a3c71604178d6?w=913&h=465&f=png&s=54866)

#### 启动

```js
cnpm install

npm run dev

```


* build

如果执行 npm run build 相当于所有平台都打包了一份，建议只build自己电脑的类型

```js
// window
npm run build:win32 

// mac
npm run build:darwin 
```

#### Question 

* 目前发现在window中不可用 因为直接将文件存在 /tmp 这个路径里 但是在window中不存在这个路径 就会报错
