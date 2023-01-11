<template>
  <div class="dashboard-container" id="combo-app">
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
      <div class="tableBar">
        <el-input
            v-model="input"
            placeholder="请输入套餐名称"
            style="width: 250px"
            clearable
            @keyup.enter.native="handleQuery"
            @clear="cleanQuery"
        >
          <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
              @click="init"
          ></i>
        </el-input>
        <div class="tableLab">
          <span class="span-btn delBut non" @click="deleteHandle('批量')">批量删除</span>
          <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
          <span
              style="border:none;"
              class="span-btn delBut non"
              @click="statusHandle('0')"
          >批量停售</span>
          <el-button
              type="primary"
              @click="addSetMeal('add')"
          >
            + 新建套餐
          </el-button>
        </div>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="60"
        ></el-table-column>
        <el-table-column
            prop="name"
            label="套餐名称"
            width="120"
        ></el-table-column>
        <el-table-column prop="image" label="图片"  align="center" width="120">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;" :src="row.image" :preview-src-list="[ `${row.image}` ]" />
          </template>
        </el-table-column>
        <el-table-column
            prop="categoryName"
            label="套餐分类"
            width="130"
        ></el-table-column>
        <el-table-column
            prop="price"
            label="套餐价"
            width="130"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.price/100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.status == '0' ? '停售' : '启售' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="最后操作时间"
        >
        </el-table-column>
        <el-table-column
            prop="description"
            label="套餐描述"
        >
          <template slot-scope="scope">
            <!-- tips悬浮提示 -->
            <el-tooltip
                placement="top"
                v-model="scope.row.showTooltip"
                :open-delay="500"
                effect="dark"
                :disabled="!scope.row.showTooltip">
              <div slot="content">{{scope.row.description}}</div>
              <div @mouseenter="showTips($event,scope.row)" class='myNote'>{{scope.row.description}}</div>
            </el-tooltip>
          </template>
        </el-table-column>

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
                @click="addSetMeal(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="statusHandle(scope.row)"
            >
              {{ scope.row.status == '0' ? '启售' : '停售' }}
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts">
      </el-pagination>
    </div>

  </div>
</template>

<script>

import * as Api from "@/api/login"
export default {
name: "combo.vue",
  data() {
    return {
      input: '',
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData : [],
      dishState : '',
      checkList: [],
      isAdmin:false,
      storeIdoptions:[],
      storeNamevalue:'',//StoreNamevalue
      storeIdvalue:'',//当前选择器的storeId
      categoryIdoptions:[],//套餐列表
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
    async getCategoryIdoptions(){
      const res = await Api.getCategoryLableValueList(String(this.storeIdvalue),String('2'));//菜品type为1,在套餐页面只需要'1'改为'2'
      if (String(res.code)==='1'){
        console.log(res)
        this.categoryIdoptions = res.data
      }else {
        this.$message.error(res.msg)
      }
    },
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
          this.getStoreById()
          this.init()
        }
      }
    },
    async init () {
      // const params = {
      //   page: this.page,
      //   pageSize: this.pageSize,
      //   name: this.input ? this.input : undefined
      // }
      const res = await Api.getSetmealList(this.page,this.pageSize,this.storeIdvalue,this.input ? this.input : undefined);
      console.log(res)
      if (String(res.code)==='1'){
        if (String(res.code) === '1') {
          this.tableData = res.data.records || []
          this.counts = res.data.total
        }
      }else {
        this.$message.error('请求出错了：' + res.msg)
      }
    },
    getImage (image) {
      return `${image}`
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    cleanQuery(){
      this.page = 1;
      this.input = undefined
      this.init()
    },
    // 添加
    addSetMeal (st) {
      if (st === 'add'){
        window.parent.menuHandle({
          id: '5',
          url: '/backend/page/combo/add.html',
          name: '添加套餐'
        },true)
      } else {
        window.parent.menuHandle({
          id: '5',
          url: '/backend/page/combo/add.html?id='+st,
          name: '修改套餐'
        },true)
      }
    },

    // 删除
    deleteHandle (type, id) {
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      this.$confirm('确定删除该套餐, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        // deleteSetmeal(type === '批量' ? this.checkList.join(',') : id).then(res => {
        //   if (res.code === 1) {
        //     this.$message.success('删除成功！')
        //     this.handleQuery()
        //   } else {
        //     this.$message.error(res.msg || '操作失败')
        //   }
        // }).catch(err => {
        //   this.$message.error('请求出错了：' + err)
        // })
      })
    },

    //状态更改
    statusHandle (row) {
      let params = {}
      if (typeof row === 'string' ){
        if (this.checkList.length == 0){
          this.$message.error('批量操作，请先勾选操作菜品！')
          return false
        }
        params.ids = this.checkList.join(',')
        params.status = row
      } else {
        params.ids = row.id
        params.status = row.status ? '0' : '1'
      }
      this.$confirm('确认更改该套餐状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        // 起售停售---批量起售停售接口

        // setmealStatusByStatus(params).then(res => {
        //   if (res.code === 1) {
        //     this.$message.success('套餐状态已经更改成功！')
        //     this.handleQuery()
        //   } else {
        //     this.$message.error(res.msg || '操作失败')
        //   }
        // }).catch(err => {
        //   this.$message.error('请求出错了：' + err)
        // })
      })
    },

    // 全部操作
    handleSelectionChange (val){
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
    },
    showTips(obj, row){
      /*obj为鼠标移入时的事件对象*/

      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement('span');
      TemporaryTag.innerText = row.description;
      TemporaryTag.className = 'getTextWidth';
      document.querySelector('body').appendChild(TemporaryTag);
      let currentWidth = document.querySelector('.getTextWidth').offsetWidth;
      document.querySelector('.getTextWidth').remove();

      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth

      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= (2*cellWidth) ? row.showTooltip = false : row.showTooltip = true
    },

  }
}
</script>

<style>
.myNote{
  display:-webkit-box;
  text-overflow:ellipsis;
  overflow:hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
}
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