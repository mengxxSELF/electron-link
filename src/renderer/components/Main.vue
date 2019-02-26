<template>
  <div class="main">
    <img width='200' src='https://user-gold-cdn.xitu.io/2019/1/31/168a3be6330a9955?w=519&h=412&f=png&s=115516'/>
    <h4> 一键链接服务器 </h4>

    <el-button type="primary" @click="showForm = true; showGroup = false">增加配置</el-button>
    <AddGroup />

    <el-button @click="showGroup = !showGroup"> {{ showGroup ? '关闭分组' : '查看已有分组' }}  </el-button>
    <Groups v-show="showGroup" />

    <el-dialog title="添加配置" :visible.sync="showForm">
      <Form v-on:hideForm="hideModal" ></Form>
    </el-dialog>

    <p> 用户本地 </p>
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
import Groups from './Groups';
import AddGroup from './AddGroup';
import { isExist, getConfig, updateConfig, getGroups } from './action.js';

export default {
  name: 'main',
  data() {
    return {
      showForm: false,
      showGroup: false,
      tableData: [],
      groups: [],
      groupsItem: [],
    };
  },
  components: {
    Table,
    Form,
    Groups,
    AddGroup,
  },
  mounted() {
    this.groups = getGroups();
    // 读取用户本地有没有 /tmp/
    const isEixst = isExist();
    if (!isEixst) return;
    const result = getConfig();
    this.tableData = result;
    window.localStorage.setItem('tableData', JSON.stringify(result));
  },
  methods: {
    // 展示某一个组的数据
    showGroups(index) {
      const result = getGroups();
      this.groupsItem = result.find(item => item.index === index).data;
    },
    // 删除
    deleteContent({
      id,
    }) {
      // 文件中删除
      const result = getConfig();
      const newData = result.filter(({ id: myId }) => myId !== id);
      this.tableData = newData;
      updateConfig(newData);
      window.localStorage.setItem('tableData', JSON.stringify(newData));
    },
    // 编辑
    editContent({
      id, title, address,
    }) {
      // 变更配置
      const result = getConfig();
      const targetIndex = result.findIndex(({ id: myId }) => myId === id);
      const target = result[targetIndex];
      target.title = title;
      target.address = address;
      this.tableData = result;
      updateConfig(result);
    },
    showModal() {
      this.isShow = true;
    },
    hideModal(info) {
      if (info) {
        // 添加服务器 -- 直接将本地数据进行添加 不进行新的请求
        this.tableData.push(info);
      }
      this.showForm = false;
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
