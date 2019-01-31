<template>
  <div class="main">
    <img width='200' src='https://user-gold-cdn.xitu.io/2019/1/31/168a3be6330a9955?w=519&h=412&f=png&s=115516'/>
    <h4> 一键链接服务器 </h4>
    <el-button type="text" @click="showModal" v-on:hideForm="hideModal">增加配置</el-button>
    <div></div>
    <Form v-if="isShow" v-on:hideForm="hideModal" ></Form>
    <Table 
      v-bind:tableData="tableData" 
      v-on:deleteContent="deleteContent"
      v-on:editContent="editContent"
    ></Table>
  </div>
</template>

<script>
import Table from './Table';
import Form from './Form';
const path = require('path');
const fs = require('fs');
const configRoot = path.resolve('/tmp/config.json');

export default {
  name: 'main',
  data() {
    return {
      isShow: false,
      tableData: [],
    };
  },
  components: {
    Table,
    Form,
  },
  mounted() {
    // 读取用户本地有没有 /tmp/
    const isEixst = fs.existsSync(configRoot);
    if (!isEixst) {
      return;
    }
    const result = JSON.parse(fs.readFileSync(configRoot, 'utf-8'));
    this.tableData = result;
    window.localStorage.setItem('tableData', JSON.stringify(result));
  },
  methods: {
    // 删除
    deleteContent({
      id, title, type, address,
    }) {
      console.log(id, title, type, address);
      // 文件中删除
      const result = JSON.parse(fs.readFileSync(configRoot, 'utf-8'));
      const newData = result.filter(({ id: myId }) => myId !== id);
      this.tableData = newData;
      fs.writeFileSync(configRoot, JSON.stringify(newData), 'utf-8');
      window.localStorage.setItem('tableData', JSON.stringify(newData));
    },
    // 编辑
    editContent({
      id, title, address,
    }) {
      // 变更配置
      const result = JSON.parse(fs.readFileSync(configRoot, 'utf-8'));
      const targetIndex = result.findIndex(({ id: myId }) => myId === id);
      const target = result[targetIndex];
      target.title = title;
      target.address = address;
      this.tableData = result;
      fs.writeFileSync(configRoot, JSON.stringify(result), 'utf-8');
    },
    showModal() {
      this.isShow = true;
    },
    hideModal(info) {
      if (info) {
        // 添加服务器 -- 直接将本地数据进行添加 不进行新的请求
        this.tableData.push(info);
      }
      this.isShow = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
img {
  border-radius: 6px;
}
</style>
