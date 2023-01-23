<template>
  <div class="dashboard-container" id="category-app">
    <div class="container">
      <div class="xuanzeqi">
        <el-tag effect="plain">
          门店ID
        </el-tag>
        <el-select @change="changeStoreId" v-model="storeIdvalue" filterable placeholder="请选择门店ID" :disabled="!isAdmin" style="margin-left: 10px">
          <el-option
              v-for="item in storeIdoptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

        <el-tag effect="plain" style="margin-left: 10px">
          门店名称
        </el-tag>

        <el-select v-model="storeNamevalue" filterable placeholder="门店Name" disabled style="margin-left: 10px">
        </el-select>

      </div>
      <div
          class="tableBar"
          style="display: inline-block"
      >
        <el-button
            type="primary"
            class="continue"
            @click="addClass"
        >
          + 新增分类
        </el-button>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >

        <el-table-column
            prop="name"
            label="分类名称"
        ></el-table-column>
        <el-table-column
            prop="type"
            label="分类类型"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '菜品分类': '套餐分类' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="操作时间"
        >
          <template slot-scope="scope">
            {{scope.row.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
        ></el-table-column>
        <el-table-column
            label="操作"
            width="160"
            align="center"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="editHandle(scope.row)"
            >
              修改
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pageList"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog
        :title="classData.title"
        :visible.sync="classData.dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <el-form
          class="demo-form-inline"
          label-width="100px"
      >
        <el-form-item label="分类名称：">
          <el-input
              v-model="classData.name"
              placeholder="请输入分类名称"
              maxlength="14"
          />
        </el-form-item>
        <el-form-item label="分类类型：">
          <el-select v-model="classData.type" placeholder="请选择">
            <el-option
                v-for="item in typeoptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序：">
          <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
        </el-form-item>
          <el-tag type="success">默认按照排序从小到大排序,出现重复则按名称首字母从小到大</el-tag>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer"
      >
        <el-button
            size="medium"
            @click="classData.dialogVisible = false"
        >取 消</el-button>
        <el-button
            type="primary"
            size="medium"
            @click="submitForm()"
        >确 定</el-button>
        <el-button
            v-if="action != 'edit'"
            type="primary"
            size="medium"
            class="continue"
            @click="submitForm('go')"
        > 保存并继续添加 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import * as Api from "@/api/login";
export default {
  name: "category",
  data() {
    return {
      action: '',//编辑还是添加
      counts: 0,
      page: 1,
      pageSize: 5,
      tableData: [],
      userInfo: {},
      token:'',
      isAdmin:false,
      storeIdoptions:[],
      storeNamevalue:'',//StoreNamevalue
      storeIdvalue:'',//当前选择器的storeId
      classData: {
        'title': '添加菜品分类',
        'dialogVisible': false,
        'categoryId': '',
        'name': '',
        sort: '',
        type:'1',
      },
      typeoptions:[
        {
          label:'菜品分类',
          value:'1'
        },
        {
          label:'套餐分类',
          value:'2'
        },
      ],
    }
  },
  computed: {},
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.token = localStorage.getItem('token')
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo){
      if (String(this.userInfo.permissions)==='1'){
        this.isAdmin = true
        this.getStoreListOnlyIdWithName()

      }else {
        this.storeIdvalue = String(this.userInfo.storeId)
        this.getStoreById()
        this.isAdmin = false
        this.init()
      }
    }else {
      this.$message.error("身份异常")
      window.location.href= '../../index.html'
    }

  },
  mounted() {
  },
  methods: {
    changeStoreId(){
      this.getStoreById()
      this.init()
    },
    async getStoreById() {
      const store = await Api.getStoreById(this.storeIdvalue);
      if (String(store.code)==='1'){
        this.storeNamevalue = store.data.name
      }
    },
    async getStoreListOnlyIdWithName(){
      const data = await Api.getStoreListOnlyIdWithName();
      if (String(data.code)==='1'){
        this.storeIdoptions = data.data
        if (this.storeNamevalue===''){
          this.storeIdvalue = data.data[0].value

          //set
          if (sessionStorage.getItem("userLastStoreId")!==""){
            this.storeIdvalue=sessionStorage.getItem("userLastStoreId")
          }

          this.getStoreById()
          this.init()
        }
      }
    },
    async init () {
      sessionStorage.setItem("userLastStoreId",this.storeIdvalue)
      const res = await Api.getCategoryPage(String(this.page),String(this.pageSize),String(this.storeIdvalue))
      if (String(res.code)==='1'){
        // console.log(res)
        this.tableData = res.data.records
        this.counts = Number(res.data.total)
      }else {
        this.$message.error(res.msg)
      }
      // await getCategoryPage({'page': this.page, 'pageSize': this.pageSize}).then(res => {
      //   if (String(res.code) === '1') {
      //     this.tableData = res.data.records
      //     this.counts = Number(res.data.total)
      //   } else {
      //     this.$message.error(res.msg || '操作失败')
      //   }
      // }).catch(err => {
      //   this.$message.error('请求出错了：' + err)
      // })
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加
    addClass() {
      if(this.storeIdvalue===''&&this.isAdmin){
        this.$message.info("请先选择门店!")
        return
      }else if (this.storeIdvalue===''){
        this.$message.error("请刷新重试!")
        return
      }
      this.classData.title = '新增分类'

      this.action = 'add'
      this.classData.name = ''
      this.classData.sort = ''
      this.classData.dialogVisible = true

    },
    editHandle(dat) {
      this.classData.title = '修改分类'
      this.action = 'edit'
      this.classData.name = dat.name
      this.classData.sort = dat.sort
      this.classData.id = dat.id
      this.classData.type = String(dat.type)
      this.classData.dialogVisible = true
    },
    // 关闭弹窗
    handleClose(st) {
      console.log(st)
      this.classData.dialogVisible = false
    },
    //删除
    deleteHandle(id) {
      console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        const res = await Api.deleteCategory(id)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error(res.msg)
        }

      })
    },
    //数据提交
    async submitForm(st) {
      console.log(st)//有'go'继续添加
      const classData = this.classData
      const valid = (classData.name === 0 || classData.name) && (classData.sort === 0 || classData.sort)
      if (this.action === 'add') {//如果为添加的话
        if (valid) {
          const reg = /^\d+$/
          if (reg.test(classData.sort)) {
            const res = await Api.addCategory(String(classData.type), String(classData.name), String(classData.sort), String(this.storeIdvalue))
            if (String(res.code) === '1') {
              this.$message.success('分类添加成功！')
              if (!st) {
                this.classData.dialogVisible = false
              } else {
                //清空classData里的值
                this.classData.name = ''
                this.classData.sort = ''
              }
              this.handleQuery()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          } else {
            this.$message.error('排序只能输入数字类型')
          }
        } else {
          this.$message.error('请输入分类名称或排序')
        }
      } else if (valid) {
        const reg = /^\d+$/
        if (reg.test(this.classData.sort)) {//排序输入的是数字
          const res = await Api.updataCategory(String(this.classData.id),String(this.classData.type),String(this.classData.name),String(this.classData.sort))
          if (String(res.code)==='1'){
            this.$message.success(res.msg)
            this.classData.dialogVisible = false
            this.handleQuery()
          }else {
            this.$message.error(res.msg)
          }

        } else {
          this.$message.error('排序只能输入数字类型')
        }
      } else {
        this.$message.error('请输入分类名称或排序')
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
    }
  }
}
</script>

<style>

.xuanzeqi {
  padding: 5px 10px 5px 10px;
  margin: 0px 3px 15px 13px;
  /*border: rgba(162, 156, 156, 0.47) 1px solid;*/
  /*border-radius: 10px;*/
}
</style>