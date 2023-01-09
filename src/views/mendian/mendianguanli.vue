<template>
  <div class="dashboard-container" id="mendian-app">
    <div class="container">
      <div class="tableBar">
        <el-input
            v-model="input"
            placeholder="请输入门店名"
            style="width: 250px"
            clearable
            @clear="cleanQuery"
            @blur="handleQuery"
            @keyup.enter.native="handleQuery"
        >
          <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"

              @click="handleQuery"
          ></i>
        </el-input>
        <el-button
            type="primary"
            @click="addMemberHandle('add')"
            :loading="dialogFormVisibles"
        >
          添加门店
        </el-button>
      </div>
      <el-table
          :data="tableData"
          v-loading="tableloading"
          stripe
          class="tableBox"
      >
        <el-table-column
            prop="name"
            label="门店名"
        ></el-table-column>
        <el-table-column
            prop="introduction"
            label="门店简介"
        ></el-table-column>

        <el-table-column label="门店状态">
          <template slot-scope="scope">
            <span :style="String(scope.row.status) === '0'? 'color: red': 'color: #0c56dc'">
              {{ String(scope.row.status) === '0' ? '休息中' : '正在营业' }}
            </span>

          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="210"
            align="center"
        >
          <template slot-scope="scope">

            <el-button type="primary" icon="el-icon-edit" circle @click="addMemberHandle(scope.row)">
            </el-button>

            <el-button type="danger" icon="el-icon-delete" circle @click="deleteMemberHandle(scope.row)"></el-button>

            <el-button v-if="String(scope.row.status) === '0'" type="info" round @click="statusHandle(scope.row)">{{ String(scope.row.status) === '1' ? '休息' : '营业' }}</el-button>
            <el-button v-else  round @click="statusHandle(scope.row)">{{ String(scope.row.status) === '1' ? '休息' : '营业' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pageList"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
      <el-dialog :show-close="false"  :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" :title="addorbianji" :visible.sync="dialogFormVisibles" style="z-index: 123412">
        <el-form :rules="rules" :model="form">

          <el-form-item  label="(必填) 门店名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入门店名称"></el-input>
          </el-form-item>
          <el-form-item label="门店简介" :label-width="formLabelWidth">
            <el-input v-model="form.introduction" autocomplete="off" placeholder="请输入门店简介"></el-input>
          </el-form-item>
          <el-form-item label="门店状态" :label-width="formLabelWidth">
            <el-select v-model="form.status" placeholder="请选择门店状态">
              <el-option label="正在营业" value="1"></el-option>
              <el-option label="休息中" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormFButton" style="margin-right: 10px">取  消</el-button>
          <span v-if="addoredit==='add'">
            <el-button type="warning" plain @click="dialogFormTANDButton" :disabled="form.name===''" :loading="dialogFormButtonLoading">添加并继续添加</el-button>
            <el-button type="primary" @click="dialogFormTButton" :disabled="form.name===''" :loading="dialogFormButtonLoading">确  定</el-button>
          </span>
          <span v-else-if="addoredit==='edit'">
            <el-button type="primary" @click="dialogFormUpdataButton" :disabled="form.name===''" :loading="dialogFormButtonLoading">更  新</el-button>
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/login";



export default {
  name: "mendianguanli",
  el: '#mendian-app',
  data() {

    return {
      formLabelWidth:'',
      input: '',
      counts: 0,
      page: 1,//默认为首页
      pageSize: 5,//默认为一页5条
      addoredit:'add',//默认是编辑模式
      tableData : [],
      tableloading:true,
      storeid : '',
      storestatus : '',
      token:'',
      userInfo:{},
      isNeedUpdata:false,
      dialogFormVisibles:false,
      addorbianji:'添加门店',
      form:{
        name:'',
        introduction:'',
        status:'1',
      },
      dialogFormButtonLoading:false,
      rules: {
        name: [
          { required: true, message: '请输入门店名', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {},
  created() {
    //存入对象
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.token = localStorage.getItem('token')
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo){
      if (this.userInfo.permissions===1){
        //获取门店列表数据
        this.tableloading = true

        this.init()
      }else {
        this.$message.error("非超级管理员,禁止访问")
        window.location.href= '../../index.html'
      }
    }else {
      this.$message.error("身份异常")
      window.location.href= '../../index.html'
    }

  },
  mounted() {
  },
  methods: {
    async init () {
      // const params = {
      //   page: this.page,
      //   pageSize: this.pageSize,
      //   name: this.input ? this.input : undefined
      // }
      const res =  await Api.getStoreList(this.page,this.pageSize,this.input ? this.input : undefined)
      console.log(res)
      if (String(res.code) === '1') {
          this.tableData = res.data.records || []
          this.counts = Number(res.data.total)
          this.tableloading = false
          this.isNeedUpdata = false
      }else {
        this.$message.error('请求出错了：' + res.msg)
      }
      // await getMemberList(params).then(res => {
      //   if (String(res.code) === '1') {
      //     this.tableData = res.data.records || []
      //     this.counts = res.data.total
      //   }
      // }).catch(err => {
      //   this.$message.error('请求出错了：' + err)
      // })
    },
    handleQuery() {//搜索
      this.page = 1;
      this.tableloading = true
      this.init();
    },
    cleanQuery(){
      this.input = ""
      this.page = 1;
      this.tableloading = true
      this.init();
    },
    // 添加
    addMemberHandle (st) {
      if (st === 'add'){
        //添加门店，弹出表单
        this.addorbianji = "添加门店"
        this.addoredit = 'add'
        this.dialogFormVisibles = true
        console.log("添加")
      } else {
        //编辑门店，弹出表单,预先填充数据
        this.addoredit = 'edit'
        this.addorbianji = "编辑门店"
        this.form.name = st.name
        this.storeid = st.id//更新操作时带上当前的门店id
        this.form.status = String(st.status)
        this.form.introduction = st.introduction
        this.dialogFormVisibles = true

        console.log("编辑")
        console.log(st)

      }
    },
    //状态修改
    statusHandle (row) {
      var that = this
      that.storeid = row.id
      that.storestatus = row.status
      // console.log(row.status)
      this.$confirm('确认调整该门店的状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        const res = await Api.enableAndDisableStore(String(that.userInfo.id), String(that.storeid), String(that.storestatus))
        if (String(res.code)==='1'){
          //更改成功
          //此处不重置页面，因为修改状态不会影响数据条数
          that.tableloading = true
          that.init()
          that.$message.success(res.msg)
        }else {
          that.$message.error(res.msg)
        }
      })
    },
    async deleteMemberHandle(row) {
      let that = this
      console.log(that.userInfo)
      const res = await Api.deleteStore(String(that.userInfo.id), String(row.id))
      if (String(res.code)==='1'){
        //删除成功
        that.$message.success(res.msg)
        //此处重置页面，因为修改状态影响数据条数
        that.handleQuery()
      }else {
        that.$message.error(res.msg)
      }
    },
    async dialogFormTButton() {
      var that = this
      console.log(this.form)
      this.dialogFormButtonLoading = true

      const res = await Api.addMenDian(that.userInfo.id,that.form.name,that.form.introduction,that.form.status)
      if (String(res.code)==='1'){
        that.dialogFormButtonLoading = false
        //清除form值,且关闭窗口，请求数据
        that.dialogFormVisibles = false
        that.$message.success(res.msg)
        that.form.name = ''
        that.form.introduction = ''
        this.handleQuery()

      }else {
        that.$message.error(res.msg)
        that.dialogFormButtonLoading = false

      }

    },
    async dialogFormTANDButton() {
      var that = this
      const res = await Api.addMenDian(that.userInfo.id,that.form.name,that.form.introduction,that.form.status)
      that.dialogFormButtonLoading = true
      if (String(res.code)==='1'){
        that.dialogFormButtonLoading = false
        //清除form值,但不关闭窗口
        that.$message.success(res.msg)
        that.form.name = ''
        that.form.introduction = ''
        that.isNeedUpdata = true;
      }else {
        that.$message.error(res.msg)
        that.dialogFormButtonLoading = false
      }

    },
    async dialogFormUpdataButton() {
      //更新
      this.dialogFormButtonLoading = true
      const res = await Api.updataMenDian(String(this.userInfo.id), String(this.storeid), String(this.form.name), String(this.form.introduction), String(this.form.status))
      if (String(res.code)==='1'){
        //更新成功
        this.$message.success(res.msg)
        this.form.status=''
        this.form.name=''
        this.form.introduction=''
        this.storeid=''
        this.dialogFormVisibles = false
        this.dialogFormButtonLoading = false
        this.tableloading = true
        this.init()
      }else {
        this.$message.error(res.msg)
        this.dialogFormButtonLoading = false

      }
    },
    dialogFormFButton(){
      this.dialogFormVisibles = false
      this.form.name = ''
      this.form.introduction = ''
      this.dialogFormButtonLoading = false
      if (this.isNeedUpdata){
        this.handleQuery()

      }
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.tableloading = true
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.tableloading = true

      this.init()
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}
.dashboard-container .container .tableBar {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.dashboard-container .container .tableBox {
  width: 100%;
  border: solid 2px #f3f4f7;
  border-radius: 2px;
}

.dashboard-container .container .tableBox .el-image img {
  width: 40px;
  border-radius: 5px;
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}

.dashboard-container .container .tableLab .span-btn {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: #818693;
  border-right: solid 1px #d8dde3;
}

.dashboard-container .container .tableLab .el-button {
  margin-left: 10px;
}

.el-table-column--selection .cell {
  padding-left: 10px;
}

/* 添加 */
.addBrand-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.addBrand-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.addBrand-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.addBrand-container .avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.addBrand-container .el-form--inline .el-form-item__content {
  width: 293px;
}
.addBrand-container .el-input {
  width: 293px;
}

.addBrand-container {
  margin: 30px;
}
.addBrand-container .container {
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  min-height: 500px;
}
.addBrand-container .container .subBox {
  padding-top: 30px;
  text-align: center;
  border-top: solid 1px #f3f4f7;
}

.flavorBox {
  width: 777px;
}
.flavorBox .addBut {
  background: #ffc200;
  display: inline-block;
  padding: 0px 20px;
  border-radius: 3px;
  line-height: 40px;
  cursor: pointer;
  border-radius: 4px;
  color: #333333;
  font-weight: 500;
}
.flavorBox .flavor {
  border: solid 1px #dfe2e8;
  border-radius: 3px;
  padding: 15px;
  background: #fafafb;
}
.flavorBox .flavor .title {
  color: #606168;
}
.flavorBox .flavor .cont .items {
  display: flex;
  margin: 10px 0;
}
.flavorBox .flavor .cont .items .itTit {
  width: 150px;
  margin-right: 15px;
}
.flavorBox .flavor .cont .items .itTit input {
  width: 100%;
  line-height: 40px;
  border-radius: 3px;
  padding: 0 10px;
}
.flavorBox .flavor .cont .items .labItems {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  border-radius: 3px;
  min-height: 39px;
  border: solid 1px #d8dde3;
  background: #fff;
  padding: 0 5px;
}
.flavorBox .flavor .cont .items .labItems span {
  display: inline-block;
  color: #f19c59;
  margin: 5px;
  line-height: 26px;
  height: 26px;
  padding: 0 10px;
  background: #fdf4eb;
  border-radius: 3px;
  border: solid 1px #fae2cd;
}
.flavorBox .flavor .cont .items .labItems span i {
  cursor: pointer;
  font-style: normal;
}
.flavorBox .flavor .cont .items .labItems .inputBox {
  display: inline-block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  overflow: hidden;
}
.flavorBox .flavor .cont .items .delFlavor {
  display: inline-block;
  padding: 0 10px;
  color: #f19c59;
  cursor: pointer;
}

.addBrand-container .address .el-form-item__content {
  width: 777px !important;
}

.el-button--text {
  font-weight: 400 !important;
  font-size: 13px !important;
}

.el-table td {
  font-size: 13px !important;
}

.el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 12px;
}

</style>