<template>
  <div>
    <el-table :data="tableData"
    border
    style="width: 100%"
    :row-class-name="tableRowClassName"
    >
    <el-table-column
      prop="id"
      label="id"
      width="180">
    </el-table-column>
    <el-table-column
      prop="title"
      label="名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="type"
      label="类型"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px"> {{ scope.row.type ? 'mysql' : 'redis' }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
     <el-table-column
      fixed="right"
      label="操作"
      width="300">
      <template slot-scope="scope">
        <el-button @click="linkServer(scope.row)" type="text" size="small">链接服务器</el-button>
        <el-button @click="showDialog(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="deleteContent(scope.row)" type="text" size="small">删除该配置</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-dialog width='80%' title="编辑服务器信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <h4> 服务器id -- {{form.id}} </h4>
        <el-form-item label="服务器名称" >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器地址" >
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editContent">确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>

// import axios from 'axios';
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const shRoot = path.resolve('/tmp/run.sh');
// const configRoot = path.resolve('/tmp/config.json');

export default {
  name: 'table',
  props: ['tableData'],
  data() {
    return {
      // tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        id: '',
        title: '',
        address: '',
      },
    };
  },
  methods: {
    // 显示
    showDialog({
      id, title, address,
    }) {
      this.form.id = id;
      this.form.title = title;
      this.form.address = address;
      this.dialogFormVisible = true;
    },
    // 确定修改
    editContent() {
      const { id, address, title } = this.form;
      this.dialogFormVisible = false;
      this.$emit('editContent', {
        id, title, address,
      });
    },
    // 删除
    deleteContent({
      id, title, type, address,
    }) {
      this.$emit('deleteContent', {
        id, title, type, address,
      });
    },
    tableRowClassName({ row, rowIndex }) {
      console.log('row', row);
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    linkServer({ address, type }) {
      this.$confirm(`您将打开 ${type ? 'mysql' : 'redis'} 地址为 ${address}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        // 1  生成 run.sh 文件
        // 根据类型判断
        let server = '';
        if (type === 0) {
          // 0 redis
          server += 'redis-cli -h';
        } else {
          // 1 msyql
          server += 'ssh';
        }

        // 不用判断文件是否存在 直接重新写入
        const content = `#!/bin/bash \n  \n ${server} ${address}`;

        // 链接服务器
        fs.writeFileSync(shRoot, content);
        // 2 给脚本增加运行权限
        exec(`chmod +x ${shRoot}`, { silent: true });
        // 3 打开一个新的终端去执行这文件
        exec(`open -a Terminal  ${shRoot}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${typeof stderr}`);
        });
      }).catch((e) => {
        console.log('e', e);
        this.$message({
          type: 'info',
          message: '已取消链接',
        });
      });
    },
  },
};
</script>


<style scoped>
div {
  width: 80%;
  min-width: 450px;
  margin: 0 auto;
}
 .warning-row {
    background: #213a14;
  }

  .success-row {
    background: #f0f9eb;
  }

</style>
