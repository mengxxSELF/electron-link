<template>
  <div>
    <el-button type="primary" @click="groupDialogVisible = true">创建分组</el-button>
    <el-dialog title="分组信息" :visible.sync="groupDialogVisible">
      <el-form :model="form">
        <el-form-item label="分组名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="groupDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addGroup',
  data() {
    return {
      groupDialogVisible: false,
      form: {
        name: '',
      },
    };
  },
};
</script>
