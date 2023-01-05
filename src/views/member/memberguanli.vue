<template>
  <div class="dashboard-container" id="member-app">
    <div class="container">
      <div class="tableBar">
        <el-input
            v-model="input"
            placeholder="请输入用户名称"
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
          添加用户
        </el-button>
      </div>
      <el-table
          :data="tableData"
          v-loading="tableloading"
          stripe
          class="tableBox"
          :cell-style="rowStyle"
      >
        <el-table-column
            prop="name"
            label="用户名称"
            align="center"
            width="120"
        ></el-table-column>
        <el-table-column
            prop="sex"
            label="性别"
            width="100"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="idNumber"
            label="身份证号"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column label="用户状态" align="center">
          <template slot-scope="scope">
            <span :style="String(scope.row.status) === '0'? 'color: red': 'color: #0c56dc'">
              {{ String(scope.row.status) === '0' ? '禁用' : '正常' }}
            </span>

          </template>
        </el-table-column>
        <el-table-column
            label="权限"
            align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ String(scope.row.permissions) === '1' ? '超级管理员' : String(scope.row.permissions) === '2' ? '门店管理' : String(scope.row.permissions) === '3' ? '用户' : null }}
            </span>
          </template>
        </el-table-column>
<!--        仅2,3权限需要-->
        <el-table-column
            prop="storeId"
            label="绑定门店Id"
            align="center"
            width="80"
        ></el-table-column>

        <el-table-column
            label="操作"
            width="210"
            align="center"
        >
          <template slot-scope="scope">

            <el-button type="primary" icon="el-icon-edit" circle @click="addMemberHandle(scope.row)">
            </el-button>

            <el-button type="danger" icon="el-icon-delete" circle @click="deleteMemberHandle(scope.row)"></el-button>

            <el-button v-if="String(scope.row.status) === '0'" type="info" round @click="statusHandle(scope.row)">{{ String(scope.row.status) === '1' ? '禁用' : '启用' }}</el-button>
            <el-button v-else  round @click="statusHandle(scope.row)">{{ String(scope.row.status) === '1' ? '禁用' : '启用' }}</el-button>
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
      <transition name="el-zoom-in-center">
        <div v-show="show2" class="transition-box">
          <el-dialog :show-close="false"  :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" :title="addorbianji" :visible.sync="dialogFormVisibles" style="z-index: 2065;">
          <el-form :rules="rules" :model="form">
            <!--          <el-form-item label="用户Id" :label-width="formLabelWidth">-->
            <!--            <el-input v-model="form.id" autocomplete="off" disabled placeholder=""></el-input>-->
            <!--          </el-form-item>-->
            <div id="onecard1" class="onecard" >
              <div style="display: flex">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                  <el-input v-model="form.username" autocomplete="off" placeholder="请输入用户用户名"></el-input>
                </el-form-item>
                <span style="width: 50px"></span>
                <el-form-item  label="用户名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <span style="width: 50px"></span>
                <el-form-item label="性别" :label-width="formLabelWidth">
                  <el-select v-model="form.sex" placeholder="请选择用户性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div style="display: flex">
                <el-form-item  label="手机号" :label-width="formLabelWidth">
                  <el-input v-model="form.phone" autocomplete="off" placeholder="请输入用户手机号"></el-input>
                </el-form-item>
                <span style="width: 50px"></span>
                <el-form-item  label="证件号" :label-width="formLabelWidth">
                  <el-input v-model="form.idNumber" autocomplete="off" placeholder="请输入用户身份证号"></el-input>
                </el-form-item>


                <span style="width: 50px"></span>
                <el-form-item v-if="isNeedPasswordInput" label="初始密码" :label-width="formLabelWidth">
                  <el-input v-model="form.password" autocomplete="off" placeholder="请输入初始密码"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="onecard" style="margin-bottom: 0px">
              <div style="display: flex">
                <el-form-item label="状态" :label-width="formLabelWidth">
                  <el-select v-model="form.status" placeholder="请选择用户状态">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <span style="width: 50px"></span>
                <el-form-item label="权限" :label-width="formLabelWidth">
                  <el-select v-model="form.permissions" placeholder="请选择用户权限" @change="permissionsChange">
                    <el-option label="超级管理员" value="1"></el-option>
                    <el-option label="门店管理" value="2"></el-option>
                    <el-option label="门店用户" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </div>




              <div>
                <el-form-item label="绑定门店Id" :label-width="formLabelWidth">
                  <el-select v-model="form.storeId" filterable placeholder="请选择绑定门店Id">
                    <el-option
                        v-for="item in storeoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="width: 50px"></span>
                  <span style="font-family: 'Leelawadee UI Semilight';font-size: 12px;margin-left: 10px ">
                      注:权限为门店管理或者用户必须绑定此项，否则无法成功提交
                  </span>

                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormFButton" style="margin-right: 10px">取  消</el-button>
            <span v-if="addoredit==='add'">
            <el-button type="warning" plain @click="dialogFormTANDButton" :disabled="form.name===''||form.permissions===''||form.sex===''||form.idNumber===''||form.phone===''||form.status===''||form.username===''" :loading="dialogFormButtonLoading">添加并继续添加</el-button>
            <el-button type="primary" @click="dialogFormTButton" :disabled="form.name===''||form.permissions===''||form.sex===''||form.idNumber===''||form.phone===''||form.status===''||form.username===''" :loading="dialogFormButtonLoading">确  定</el-button>
          </span>
            <span v-else-if="addoredit==='edit'">
            <el-button type="primary" @click="dialogFormUpdataButton" :disabled="form.name===''||form.permissions===''||form.sex===''||form.idNumber===''||form.phone===''||form.status===''||form.username===''" :loading="dialogFormButtonLoading">更  新</el-button>
          </span>
          </div>
        </el-dialog>
        </div>
      </transition>
          </div>
  </div>
</template>

<script>
import * as Api from "@/api/login";

export default {
  name: "memberguanli",
  el: '#member-app',
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
      userid : '',//当前用户id
      userstatus : '',
      token:'',
      storeoptions:[{
        value: '1',//门店ID字符串
        label: '某某店(Id:1)'
      }],
      userInfo:{},
      isNeedUpdata:false,
      dialogFormVisibles:false,
      isNeedPasswordInput:false,
      addorbianji:'添加用户',
      form:{
        name:'',
        username:'',
        phone:'',
        idNumber:'',
        status:'1',
        permissions:'',
        storeId:'',
        sex:'',
        password:'123456',
      },
      dialogFormButtonLoading:false,
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
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
        //获取用户列表数据
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
      const res =  await Api.getMemberList(this.page,this.pageSize,this.input ? this.input : undefined)
      console.log(res)
      if (String(res.code) === '1') {
          this.tableData = res.data.records || []
          this.counts = res.data.total
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
      const storeseletelist = await Api.getStoreListOnlyIdWithName()
      if (String(storeseletelist.code)==='1'){
        this.storeoptions = storeseletelist.data
      }
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

      // this.storeoptions = []//门店选择器，请求返回

      if (st === 'add'){
        //添加用户，弹出表单
        this.addorbianji = "添加用户"
        this.addoredit = 'add'
        this.dialogFormVisibles = true
        this.isNeedPasswordInput = true
        console.log("添加")
      } else {
        //编辑用户，弹出表单,预先填充数据
        this.isNeedPasswordInput = false
        this.addoredit = 'edit'
        this.addorbianji = "编辑用户"
        this.form.name = st.name
        this.userid = st.id//更新操作时带上当前的用户id
        this.form.status = String(st.status)
        this.form.idNumber = String(st.idNumber)
        this.form.phone = String(st.phone)
        this.form.username = String(st.username)
        this.dialogFormVisibles = true
        this.form.sex = String(st.sex)
        this.form.permissions = String(st.permissions)
        this.form.storeId = String(st.storeId)
        console.log("编辑")
        console.log(st)

      }
    },
    //状态修改
    statusHandle (row) {
      var that = this
      that.userid = row.id
      that.userstatus = row.status
      // console.log(row.status)
      this.$confirm('确认调整该用户的状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        const res = await Api.enableAndDisableEmployee(String(that.userid),String(that.userInfo.id), String(that.userstatus))
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
      const res = await Api.deleteEmployee(String(row.id),String(that.userInfo.id))
      if (String(res.code)==='1'){
        //删除成功
        that.$message.success(res.msg)
        //此处重置页面，因为修改状态影响数据条数
        that.handleQuery()
      }else {
        that.$message.error(res.msg)
      }
    },
    cleanform(){
      this.form.status=''
      this.form.name=''
      this.form.username=''
      this.form.sex = ''
      this.form.phone=''
      this.form.permissions=''
      this.form.storeId=null
      this.form.idNumber=''
      this.userid=''
      this.userstatus = ''
    },
    async dialogFormTButton() {
      var that = this
      console.log(this.form)
      this.dialogFormButtonLoading = true

      const res = await Api.addmember(that.form)
      if (String(res.code)==='1'){
        that.dialogFormButtonLoading = false
        //清除form值,且关闭窗口，请求数据
        that.dialogFormVisibles = false
        that.$message.success(res.msg)
        that.cleanform()
        this.handleQuery()

      }else {
        that.$message.error(res.msg)
        that.dialogFormButtonLoading = false

      }

    },
    async dialogFormTANDButton() {
      var that = this
      const res = await Api.addmember(that.form)
      that.dialogFormButtonLoading = true
      if (String(res.code)==='1'){
        that.dialogFormButtonLoading = false
        //清除form值,但不关闭窗口
        that.$message.success(res.msg)
        that.cleanform()
        that.isNeedUpdata = true;
      }else {
        that.$message.error(res.msg)
        that.dialogFormButtonLoading = false
      }

    },
    permissionsChange(){
      if (String(this.form.permissions)==='1'){
        this.form.storeId=null
      }else {
        if (this.form.storeId===''||this.form.storeId==undefined||this.form.storeId===null){
          this.form.storeId = undefined
        }

      }
    },
    async dialogFormUpdataButton() {
      //更新
      this.dialogFormButtonLoading = true
      const res = await Api.updataMember(this.form,String(this.userid))
      if (String(res.code)==='1'){
        //更新成功
        this.$message.success(res.msg)
        this.cleanform()
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
      this.cleanform()
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
    },
    rowStyle() {
      return "text-align:center";
    },
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

.dashboard-container .container .tableLab span {
  text-align: center;
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
  text-align: center;
  padding-left: 12px;
}

.cell{
  text-align: center;
}
.onecard {
  border: #ece9e9 1px solid;
  padding: 15px 15px 5px 15px;
  border-radius: 10px;
  margin-bottom: 5px;
}
</style>