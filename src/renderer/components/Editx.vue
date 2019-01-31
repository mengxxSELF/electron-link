<template>
  <div>
    <p> 名称 </p>
    <el-input placeholder="title" v-model="title"></el-input>
    <p> 地址 </p>
    <el-input placeholder="address" v-model="address"></el-input>
    <p> 类型 </p>
    <el-radio v-model="type" label="1">mysql</el-radio>
    <el-radio v-model="type" label="0">redis</el-radio>
  </div>
</template>

<script>
export default {
  props: ['title', 'address', 'type'],
  data() {
    return {};
  },
};
</script>

<style scoped>
div {
  margin: 10px 0;
}
</style>
