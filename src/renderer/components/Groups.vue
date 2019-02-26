<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="group in groups" :key="group.index" :label="group.title">
      <Table 
      v-if="groupsItem.length"
      v-bind:tableData="groupsItem" 
      v-on:deleteContent="deleteContent"
      v-on:editContent="editContent"
      ></Table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Table from './Table';
import { getGroups } from './action.js';

export default {
  data() {
    return {
      activeName: '',
      groups: [],
      groupsItem: [],
    };
  },
  components: {
    Table,
  },
  async mounted() {
    this.groups = await getGroups();
    this.groupsItem = this.groups[0].data;
  },
  methods: {
    // 切换tab
    handleClick() {
      this.groupsItem = this.groups[this.activeName].data;
    },
    // 删除
    deleteContent() {

    },
    // 编辑服务器信息
    editContent() {

    },
  },
};
</script>


<style scoped>
.el-tabs__header {
  width: 80%;
  min-width: 450px;
  margin: 0 auto;
}
</style>