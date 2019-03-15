<template>
  <el-form>
    <el-form-item label="地址" >
      <el-input v-model="address" @blur="checkAddress" clearable ></el-input>
    </el-form-item>
    <el-form-item label="名称" >
      <el-input v-model="title" @blur="checkTitle"  clearable></el-input>
    </el-form-item>
    <el-form-item label="类型" >
      <el-select v-model="type" placeholder="请选择类型">
        <el-option label="mysql" value="1"></el-option>
        <el-option label="redis" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否添加到分组共享数据" >
      <el-select v-model="group" placeholder="请选择分组">
        <el-option v-for="(group, index) in allGroup"  :label="group.name"  :key="index" :value="group.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认添加配置</el-button>
      <el-button @click="$emit('hideForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isExist, getConfig, updateConfig, get_groups, add_config } from './action.js';

export default {
  data() {
    return {
      title: '',
      address: '',
      type: '',
      group: '',
      allGroup: []
    };
  },
  mounted() {
    get_groups({}).then(({data}) => {
      const { result } = data
      console.log('当前所有分组', result)
      this.allGroup = [{ id: -1, name: '只在本地，不添加到分组' }, ...result]
    }).catch((e) => {
      console.log('e', e)
    })
  },
  methods: {
    // 检测地址是否已经存在
    checkAddress() {
      const { address } = this;
      if (!address) return;
      const { tableData } = localStorage;
      if (!tableData) return;
      const data = JSON.parse(tableData);
      const isExit = data.some(item => item.address === address);
      if (isExit) {
        this.$message({
          message: '该地址已存在',
          type: 'success',
        });
      }
    },
    checkTitle() {
      const { title } = this;
      if (!title) return;
      const { tableData } = localStorage;
      if (!tableData) return;
      const data = JSON.parse(tableData);
      const isExit = data.some(item => item.title === title);
      if (isExit) {
        this.$message({
          message: '该名称已存在',
          type: 'success',
        });
      }
    },
    submit() {
      const { address, title, type, group } = this;
      console.log('group', group)
      // 空值判断
      if (!address || !title || !type) {
        this.$message({
          message: `该 ${!address && '地址'} ${!title && '名称'} ${!type && '类型'} 为空 请添加内容`,
          type: 'success',
        });
        return;
      }
      // 二次确认地址和名称是否有重复的
      // const { tableData } = localStorage;
      // const data = JSON.parse(tableData);
      // const isExitTitle = data.some(item => item.title === title);
      // const isExitAddress = data.some(item => item.address === address);
      // if (isExitTitle || isExitAddress) {
      //   this.$message({
      //     message: `该 ${isExitTitle && '名称'} ${isExitAddress && '地址'} 已存在`,
      //     type: 'success',
      //   });
      //   return;
      // }
      const content = { address, type, title, groups: group || -1 };
      let info = null;
      // 选择添加到分组 
      if (group > 0) {
        add_config({ ...content })
        info = [{ address, title, type, group }]
      } else {
        if (isExist()) {
          // 如果已经存在该文件
          const result = getConfig();
          const newId = result.length ? Number(result[result.length - 1].id) + 1 : 0;
          info = { id: newId, ...content };
          result.push(info);
          updateConfig(result);
        } else {
          // 不存在 直接写入
          info = [{ id: 0, ...content }];
          updateConfig(info);
        }
      }

      // 将表单信息写入本地
      this.$message({
        message: '添加成功',
        type: 'success',
      });

      this.$emit('hideForm', {
        address, title, type, groups: group
      });
    },
  },
};
</script>

<style scoped>
  div {
    width: 80%;
    margin: 0 auto 10px;
  }
</style>
