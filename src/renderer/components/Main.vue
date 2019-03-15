<template>
  <div class="main">
    <img width='200' src='https://user-gold-cdn.xitu.io/2019/1/31/168a3be6330a9955?w=519&h=412&f=png&s=115516'/>
    <h4> 一键链接服务器 </h4>
    <el-button type="text" @click="showModal" v-on:hideForm="hideModal">增加配置</el-button>
    <div v-show="canUpdate">
      <p> 已有新版本 </p>
      <el-button type="default"> <a href='' type='download'> 下载最新版 </a> </el-button>
    </div>

    <el-dialog
      title="增加配置"
      width='50%'
      :visible.sync="isShow"
    >
      <Form v-on:hideForm="hideModal" ></Form>
    </el-dialog>

    <div></div>
    <div class='radios'>
      分组共享配置
      <el-radio @change="handleCheckedGroupsChange" v-for="(group, index) in groups" v-model="radio" :label="group.id"  :key="index">{{group.name}}</el-radio>
    </div>

    <Table 
      :tableData="tableData" 
      :groups="groups" 
      v-on:deleteContent="deleteContent"
      v-on:editContent="editContent"
    ></Table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import Table from './Table';
import Form from './Form';
import { isExist, getConfig, updateConfig, get_groups, delete_config, edit_config, check_version } from './action.js';

export default {
  name: 'main',
  data() {
    return {
      isShow: false,
      tableData: [],
      canUpdate: false,
      groups: [],
      radio: null
    };
  },
  components: {
    Table,
    Form,
  },
  mounted() {
    // 读取用户本地有没有 /tmp/
    const isEixst = isExist();
    if (!isEixst) return;
    const result = getConfig();
    // console.log('result - result', result)
    this.tableData = [...result];
    window.localStorage.setItem('tableData', JSON.stringify(result));
    // 监听主进程中返回信息
    // ipcRenderer.on('version', (_, canUpdate) => {
    //   // console.log('version', event, canUpdate);
    //   this.canUpdate = canUpdate
    // });
    // // version
    // // console.log('checkVersion - checkVersion');
    // ipcRenderer.send('checkVersion');
    check_version().then(({data}) => {
      const {canUpdate} = data
      this.canUpdate = canUpdate
    })

    // 查询分组
    // ipcRenderer.send('getGroup');
    get_groups({}).then(({data}) => {
      const { result } = data
      console.log('当前所有分组', result)
      this.groups = result
    }).catch((e) => {
      console.log('e', e)
    })

  },
  methods: {
    handleCheckedGroupsChange(value) {
      
      const locationData = getConfig();
      // 将选中的分组 做数据展示
      get_groups({group: value}).then(({data}) =>{
        const { result } = data
        // console.log('this.tableData', result)
        if (!result || !result.length) return
        this.tableData = [...locationData, ...result] 
        // console.log('this.tableData', this.tableData)
      })
    },
    // 删除
    deleteContent({
      id, groups
    }) {
      let newData = []
      if (groups && groups > 0) {
        // 服务器删除
        delete_config(id)
        newData = this.tableData.filter(({ id: myId, groups: myGroups }) => myId !== id);
      } else {
        // 文件中删除
        const result = getConfig();
        newData = result.filter(({ id: myId }) => myId !== id);
        updateConfig(newData);
      }

      this.tableData = newData;
      window.localStorage.setItem('tableData', JSON.stringify(newData));
    },
    // 编辑
    editContent({
      id, title, address, groups
    }) {
      if (groups) {
        edit_config({ id, title, address })
        const result = this.tableData
        const targetIndex = this.tableData.findIndex(({ id: myId, groups: myGroups }) => myId === id && groups == myGroups);
        const target = result[targetIndex];
        target.title = title;
        target.address = address;
        this.tableData = result;
      } else {
        // 变更配置
        const result = getConfig();
        const targetIndex = result.findIndex(({ id: myId }) => myId === id);
        const target = result[targetIndex];
        target.title = title;
        target.address = address;
        this.tableData = result;
        updateConfig(result);
      }
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
.radios {
  text-align: left;
  padding:10px 100px;
}
</style>
