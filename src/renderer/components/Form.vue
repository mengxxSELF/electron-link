<template>
  <el-form label-width="80px">
    <el-form-item label="地址">
      <el-input v-model="address" @blur="checkAddress" clearable ></el-input>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="title" @blur="checkTitle"  clearable></el-input>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="type" placeholder="请选择类型">
        <el-option label="mysql" value="1"></el-option>
        <el-option label="redis" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="环境">
      <el-select v-model="env" placeholder="请选择环境">
        <el-option label="测试环境" value="test"></el-option>
        <el-option label="线上环境" value="pro"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分组">
      <el-select v-model="group" placeholder="是否将其添加到某一个组">
        <el-option v-for="item in groups" :key="item.index" :label="item.title" :value="item.index"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认添加配置</el-button>
      <el-button @click="$emit('hideForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isExist, getConfig, updateConfig, getGroups, addSystem } from './action.js';

export default {
  data() {
    return {
      title: '',
      address: '',
      type: 'mysql',
      group: '本配置不共享, 不添加到分组',
      groups: [],
      env: 'test',
    };
  },
  mounted() {
    this.groups = getGroups();
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
      const {
        address, title, type, env, group,
      } = this;
      // 空值判断
      if (!address || !title || !type || !env) {
        this.$message({
          message: `该 ${!address && '地址'} ${!title && '名称'} 为空 请补充完整`,
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
      const content = {
        address, type, title, env,
      };

      // 判断如果是 有group 则直接写入mysql表中
      if (group && group > 0) {
        addSystem(content);
        return;
      }

      let info = null;
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

      // 将表单信息写入本地
      this.$message({
        message: '添加成功',
        type: 'success',
      });
      this.$emit('hideForm', {
        id: info.id, address, title, type,
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
