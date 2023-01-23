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
<!--          <template slot-scope="scope">-->
<!--            <span>￥{{ scope.row.price }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="售卖状态" width="130">
          <template slot-scope="scope">
            <span :style="String(scope.row.status) === '0'? 'color: red;margin-right: 10px;': 'color: #0c56dc;margin-right: 10px;'">{{ scope.row.status == '0' ? '停售' : '启售' }}</span>
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
                @click="addSetMeal(scope.row)"
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
    <div>
      <el-dialog
          :title="classData.title"
          :visible.sync="classData.dialogVisible"
          width="95%"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :append-to-body="true"
          style="z-index: 2100"
      >
        <el-form
            ref="classData"
            :model="classData"
            :rules="rules"
            :inline="true"
            label-width="120px"
            class="demo-classData"
        >
          <div>
            <el-form-item
                label="套餐名称:"
                prop="name"
            >
              <el-input
                  v-model="classData.name"
                  placeholder="请填写套餐名称"
                  maxlength="20"
              />
            </el-form-item>
            <el-form-item label="套餐分类：" prop="categoryId">
              <el-select v-model="classData.categoryId" placeholder="请选择">
                <el-option
                    v-for="item in categoryIdoptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="售卖状态：">
              <el-select v-model="classData.status" placeholder="请选择">
                <el-option
                    v-for="item in statusoptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item
                label="套餐价格:"
                prop="price"
            >
              <el-input
                  v-model="classData.price"
                  placeholder="请设置套餐价格"
              />
            </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
            </el-form-item>
<!--            <el-tag type="success">默认按照排序从小到大排序,出现重复则按名称首字母从小到大</el-tag>-->
            <el-form-item
                label="套餐描述:"
                prop="region"
            >
              <el-input
                  v-model="classData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="套餐描述，最长200字"
                  maxlength="200"
              />
            </el-form-item>
          </div>
          <div>
            <el-form-item
                label="套餐图片:"
                prop="region"
                class="uploadImg"
            >
              <el-upload
                  class="avatar-uploader"
                  action="http://localhost:8081/api/common/uploadimage"
                  :headers="headerObj"
                  v-loading="isimageupload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeUpload"
                  ref="upload"
              >
                <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    class="avatar"
                />
                <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                ></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="套餐菜品:" class="setmealFood">
              <el-form-item>
                <div class="addDish">
                  <span v-if="dishTable.length == 0" class="addBut" @click="openAddDish"> + 添加菜品</span>
                  <div v-if="dishTable.length != 0" class="content">
                    <div class="addBut" style="margin-bottom: 20px" @click="openAddDish">+ 添加菜品</div>
                    <div class="table">
                      <el-table :data="dishTable" style="width: 100%">
                        <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
                        <el-table-column prop="price" label="原价" width="180">
                          <template slot-scope="scope"> {{ Number(scope.row.price) / 100 }} </template>
                        </el-table-column>
                        <el-table-column prop="address" label="份数" align="center">
                          <template slot-scope="scope">
                            <el-input-number
                                v-model="scope.row.copies"
                                size="small"
                                :min="1"
                                :max="99"
                                label="描述文字"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="180px;" align="center">
                          <template slot-scope="scope">
                            <el-button type="text" size="small" @click="delDishHandle(scope.$index)"> 删除 </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form-item>
          </div>


        </el-form>

        <span
            slot="footer"
            class="dialog-footer"
        >
                <el-button
                    size="medium"
                    @click="cancel()"
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
        <el-dialog
            title="添加菜品"
            class="addDishList"
            :visible.sync="dish.dialogVisible"
            width="80%"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            style="z-index: 2101"
        >
          <el-input
              v-model="dishvalue"
              class="seachDish"
              placeholder="请输入菜品名称进行搜索"
              style="width: 250px"
              size="small"
              @clear="dishSeachHandle('q')"
              @keyup.enter.native="dishSeachHandle"
              clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="dishSeachHandle"></i>
          </el-input>
          <!-- <AddDish ref="adddish" :check-list="dishCheckList" :seach-key="seachKey" @checkList="getCheckList" /> -->

          <div class="addDishCon">
            <div class="leftCont">
              <div
                  v-show="seachKey.trim() == ''"
                  class="tabBut"
              >
              <span
                  v-for="(item, index) in dishType"
                  :key="index"
                  :class="{act:index == keyInd}"
                  @click="dishCheckTypeHandle(index, item.value)"
              >{{ item.label }}</span>
              </div>
              <div class="tabList">
                <div class="table">
                  <div v-if="dishAddList.length == 0" style="padding-left:10px">
                    暂无菜品!
                  </div>
                  <el-checkbox-group
                      v-if="dishAddList.length > 0"
                      v-model="dishCheckedList"
                      @change="dishCheckedListHandle"
                  >
                    <div
                        v-for="(item, index) in dishAddList"
                        :key="index"
                        class="items"
                    >
                      <el-checkbox
                          :key="index"
                          :label="item"
                      >
                        <div class="item">
                          <span style="flex: 3;text-align: left">{{ item.dishName }}</span>
                          <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                          <span>{{ Number(item.price)/100 }}</span>
                        </div>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div class="ritCont">
              <div class="tit">
                已选菜品({{ dishCheckedList.length }})
              </div>
              <div class="items">
                <div
                    v-for="(item, ind) in dishCheckedList"
                    :key="ind"
                    class="item"
                >
                  <span>{{ item.dishName }}</span>
                  <span class="price">￥ {{ Number(item.price)/100 }} </span>
                  <span
                      class="del"
                      @click="delCheck(ind)"
                  >
<!--                  <img-->
<!--                      src="../../images/icons/btn_clean@2x.png"-->
<!--                      alt=""-->
<!--                  >-->
                </span>
                </div>
              </div>
            </div>
          </div>

          <span slot="footer" class="dialog-footer">
          <el-button @click="dishHandleClose">取 消</el-button>
          <el-button type="primary" @click="addDishTableList">确 定</el-button>
        </span>
        </el-dialog>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import * as Api from "@/api/login"
import * as imageConversion from "image-conversion";

export default {
name: "combo.vue",
  data() {
    return {
      headerObj: {
        Authorization: localStorage.getItem('token'),
        userid:localStorage.getItem('userid')
      },
      input: '',
      dishvalue:'',
      keyInd:0,
      seachKey:'',
      dishType:[],//添加套餐时的菜品类别
      dishAddList:[],//待添加list
      dishCheckedList:[],//已选菜品
      dishTable:[],
      dishCheckList:[],
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
      imageUrl: '',
      classData: {
        id:'',//id，编辑的时候需要
        title: '新建套餐',
        dialogVisible: false,
        foodId: '',
        name: '',//套餐名
        sort: '',//套餐排序
        status:'1',//默认上架
        categoryId:'',//套餐分类id
        price:'',
        image:'',//url
        description:'',//描述
        version:'',//套餐版本号
        code:'',//对应服务端，暂时没搞懂有什么用,
        dishResults:[],//用于传输菜品
        storeId:'',
      },
      dish:{
        dialogVisible: false,

      },
      isimageupload:false,//图片是否再上传,
      action:"add",//默认是上传
      statusoptions:
      [
          {
            label:"上架",
            value:"1"
          },
          {
            label:"停售",
            value:"0"
          }
      ],


    }
  },
  computed: {
    rules () {
      return {
        'name': [
          {'required': true, 'message': '请填写套餐名称', 'trigger': 'blur'}
        ],
        'categoryId': [
          {'required': true, 'message': '请选择套餐分类', 'trigger': 'change'}
        ],
        'price': [
          {
            'required': true,
            // 'message': '请填写套餐价格',
            validator: (rules, value, callback) => {
              if (!value) {
                callback(new Error('请填写套餐价格'))
              } else {
                const reg = /^\d+(\.\d{0,2})?$/
                if (reg.test(value)) {
                  if(value < 10000){
                    callback()
                  }else{
                    callback(new Error('套餐价格小于10000'))
                  }
                } else {
                  callback(new Error('套餐价格格式只能为数字,且最多保留两位小数'))
                }
              }
            },
            'trigger': 'blur'
          }
        ],
      }
    }
  },
  watch:{
    // seachKey(value){
    //   if (value.trim()){
    //     this.getDishForName(this.seachKey)
    //   }
    // },
    checkList(value){
      this.checkedList = value
    }
  },
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
        this.classData.storeId = String(this.userInfo.storeId)
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
      const res = await Api.getCategoryLableValueList(String(this.storeIdvalue),String('2'));//套餐type为1,在套餐页面只需要'1'改为'2'
      if (String(res.code)==='1'){
        console.log(res)
        this.categoryIdoptions = res.data
      }else {
        this.$message.error(res.msg)
      }
    },
    changeStoreId(){
      this.classData.storeId = this.storeIdvalue
      this.getStoreById()
      this.init()
    },
    async getStoreById() {
      const store = await Api.getStoreById(this.storeIdvalue);
      if (String(store.code)==='1'){
        this.storeNamevalue = store.data.name
      }
    },
    cleanform(){
      this.classData.sort=''
      this.classData.name=''
      this.classData.image=''
      this.imageUrl = ''
      this.classData.price=''
      this.classData.description=''
      this.dishCheckedList = []
      this.dishTable = []
      this.dishCheckList = []
    },
    // 关键词收搜菜品列表分类
    async getDishForName(name) {
      const res = await Api.queryDishList(undefined,this.storeIdvalue,name)
      if (String(res.code) === '1') {
        if (res.data.length == 0) {
          this.dishAddList = []
          return
        }
        let newArr = res.data;
        newArr.forEach((n) => {
          n.dishId = n.id
          n.copies = 1
          // n.dishCopies = 1
          n.dishName = n.name
        })
        this.dishAddList = newArr
      }
    },
    // 添加菜品
    openAddDish() {
      this.seachKey = ''
      this.dish.dialogVisible = true
      //搜索条件清空，菜品重新查询，菜品类别选第一个重新查询
      this.dishvalue = ''
      this.keyInd = 0
      this.getDishList(this.dishType[0].value)
    },
    // 获取套餐分类
    async getDishType() {
      const res = await Api.getCategoryLableValueList(String(this.storeIdvalue), String('1'));//分类type为1,在套餐页面只需要'1'改为'2'
      if (String(res.code) === '1') {
        console.log("type:"+res)
        this.dishType = res.data
        this.getDishList(res.data[0].value)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 获取添加菜品数据
    getCheckList(value) {
      this.dishCheckedList = [...value]
      console.log("获取添加菜品数据"+this.dishCheckedList)
    },
    dishCheckedListHandle() {
      this.getCheckList(this.dishCheckedList)
    },
    dishHandleClose(){
      this.dish.dialogVisible = false
    },
    addDishTableList(){
      // this.dishTable = JSON.parse(JSON.stringify(this.dishCheckedList))
      let dishcheckedl = JSON.parse(JSON.stringify(this.dishCheckedList));
      console.log(dishcheckedl)
      if(dishcheckedl!==undefined){  //必须加判断  不然会不识别forEach
        dishcheckedl.forEach(n=>{
          n.copies = 1
          this.dishTable.push(n)
        })
      }
      this.dish.dialogVisible = false
      // 添加处理逻辑清空选中list
      this.dishCheckList = []
    },
    dishSeachHandle(s){
      if (s==='q'){
        this.seachKey = ''
        this.getDishForName(this.seachKey)
      }else {
        this.seachKey = this.dishvalue
        this.getDishForName(this.seachKey)
      }

    },
    dishCheckTypeHandle (ind,id) {
      this.keyInd = ind
      this.getDishList(id)
    },
    // 通过套餐ID获取菜品列表分类
    async getDishList(id) {
      const res = await Api.queryDishList(id, this.storeIdvalue,'')
      if (String(res.code)==='1'){
          if (res.data.length == 0) {
            this.dishAddList = []
            return
          }
          let newArr = res.data;
          newArr.forEach((n) => {
            n.dishId = n.id
            n.copies = 1
            // n.dishCopies = 1
            n.dishName = n.name
          })
          this.dishAddList = newArr
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

          this.storeId = data.data[0].value
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
      sessionStorage.setItem("userLastStoreId",this.storeIdvalue)
      const res = await Api.getSetmealList(this.page,this.pageSize,this.storeIdvalue,this.input ? this.input : undefined);
      console.log(res)
      if (String(res.code)==='1'){
        if (String(res.code) === '1') {
          if (res.msg==="没有数据哦"){
            this.$message.success(res.msg)
            this.tableData = []
            this.counts = 0
          }else {
            this.tableData = res.data.records || []
            this.counts = Number(res.data.total)
          }
        }
      }else {
        this.$message.error('请求出错了：' + res.msg)
      }

      this.getDishType()
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
    // 删除
    deleteHandle (type, id) {
      let params = {}
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      params.id = String(type === '批量' ? this.checkList.join(',') : id)
      this.$confirm('确定删除该套餐, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(async () => {
        const res = await Api.deleteSetmeal(params)
        if (String(res.code)==='1'){
            this.$message.success('删除成功！')
            this.handleQuery()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },

    //状态更改
    statusHandle (row) {
      let params = {}
      if (typeof row === 'string' ){
        if (this.checkList.length == 0){
          this.$message.error('批量操作，请先勾选操作套餐！')
          return false
        }
        params.ids = this.checkList.join(',')
        params.status = row
      } else {
        params.ids = row.id
        params.status = String(row.status)==='1' ? '0' : '1'
      }
      this.$confirm('确认更改该套餐状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        const res = await Api.setmealStatusByStatus(params)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
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
    handleAvatarSuccess (response, file, fileList) {//上传图片成功的回调
      console.log(file)
      console.log(fileList)
      // 拼接down接口预览
      if (String(response.code)==='1'){
        this.imageUrl = response.data
        this.classData.image = response.data
      }else {
        this.imageUrl = ''
        this.classData.image = ''
        this.$message.error(response.msg)
      }
      this.isimageupload = false

      this.$refs.upload.clearFiles()


    },
    beforeUpload(file) {
      this.isimageupload = true
      const suffix = file.name.split('.')[1]
      const size = file.size / 1024 / 1024 < 8
      if (!['png', 'jpeg', 'jpg'].includes(String(suffix))) {
        this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
        this.$refs.upload.clearFiles()
        return false
      }
      if (!size) {
        this.$message.error('上传文件大小超过 8MB，将会被强制压缩')
      }
      const isLt8M = size;
      return new Promise((resolve) => {
        // 小于8M 不压缩
        if (isLt8M) {
          resolve(file)
        }
        // 压缩到8192KB,这里的8192就是要压缩的大小,可自定义
        imageConversion.compressAccurately(file, 8192).then((res) => {
          console.log(res);
          resolve(res);
        });

      });
    },
    // 添加
    addSetMeal(st) {
      console.log(st)
      if(this.storeIdvalue===''&&this.isAdmin){
        this.$message.info("请先选择门店!")
        return
      }else if (this.storeIdvalue===''){
        this.$message.error("请刷新重试!")
        return
      }
      this.getCategoryIdoptions()
      if (st === 'add'){
        this.action = 'add'
        this.cleanform()
        this.classData.title = '新增套餐'
        this.classData.dialogVisible = true
      } else {
        this.action = 'edit'
        this.classData.title = '编辑套餐'
        this.classData.id = String(st.id)
        this.classData.name = String(st.name)
        this.classData.categoryId = String(st.categoryId)
        this.classData.sort = String(st.sort)
        this.classData.price = String(st.price)
        this.classData.status = String(st.status)
        this.classData.description = String(st.description)
        this.classData.image = String(st.image)
        this.imageUrl = String(st.image)
        this.classData.version = String(st.version)
        this.getSetmealDish(st.id)
        // this.getFoodFlavor(st.id)
        this.classData.dialogVisible = true
      }
    },
    async submitForm(st) {
      this.classData.storeId = String(this.storeIdvalue)
      if ((st === 'go')&&this.action==='add') {
        //继续添加
        //添加
        console.log(this.dishTable)
        console.log(this.classData)
        console.log(this.dishCheckList)
        this.classData.dishResults = this.dishTable
        // console.log(this.dishFlavors)
        const res = await Api.addSetmeal(this.classData)
        if (String(res.code)==='1'){
          console.log(res)
          this.$message.success(res.msg)
          this.cleanform()
          this.handleQuery()
        }else {
          this.$message.error(res.msg)
        }
      } else {
        //添加
        if (this.action==='add'){
          console.log(this.dishTable)
          console.log(this.classData)
          console.log(this.dishCheckList)
          this.classData.dishResults = this.dishTable
          // console.log(this.dishFlavors)
          const res = await Api.addSetmeal(this.classData)
          if (String(res.code)==='1'){
            console.log(res)
            this.$message.success(res.msg)
            this.cleanform()
            this.handleQuery()
            // this.dialogVisible = false
            this.classData.dialogVisible = false
          }else {
            this.$message.error(res.msg)
          }
        }else if (this.action==='edit'){
          let data = {}
          data.categoryId = this.classData.categoryId
          data.description = this.classData.description
          data.id = this.classData.id
          data.image = this.classData.image
          data.name = this.classData.name
          data.price = this.classData.price
          data.sort = this.classData.sort
          data.status = this.classData.status
          data.storeId = this.classData.storeId
          data.version = this.classData.version
          data.code = this.classData.code
          data.dishResults = this.dishTable
          console.log("edit")
          const res = await Api.editSetmeal(data)
          if (String(res.code)==='1'){
            this.$message.success(res.msg)
              this.cancel()
              this.handleQuery()
          }else {
            this.$message.error(res.msg)
          }

        }

      }
    },
    cancel(){
      this.classData.dialogVisible = false
      this.cleanform()
    },
    // 删除套餐菜品
    delDishHandle(index) {
      this.dishTable.splice(index, 1)
      this.dishCheckList.splice(index, 1)
    },
    async getSetmealDish(id) {
      let params = {}
      params.id = id
      const res = await Api.getSetmealDish(params)
      if (String(res.code)==='1'){
        let newArr = res.data;
        newArr.forEach((n) => {
          n.dishId = n.id
          // n.dishCopies = 1
          n.dishName = n.name
        })
        this.dishTable = newArr
      }else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style>

.addDish .el-input {
  width: 130px;
}
.addDish .el-input-number__increase {
  border-left: solid 1px #FFE1CA;
  background: #fff3ea;
}
.addDish .el-input-number__decrease {
  border-right: solid 1px #FFE1CA;
  background: #fff3ea;
}
.addDish input {
  border: 1px solid #ffe1ca;
}
.addDish .table {
  border: solid 1px #EBEEF5;
  border-radius: 3px;
}
.addDish .table th {
  padding: 5px 0;
}
.addDish .table td {
  padding: 7px 0;
}
.addDishList .seachDish {
  position: absolute;
  top: 10px;
  right: 20px;
}
.addDishList .el-dialog__body {
  padding: 0;
  border-bottom: solid 1px #ccc;
}
.addDishList .el-dialog__footer {
  padding-top: 27px;
}

.addDish {
  width: 777px;
}
.addDish .addBut {
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
.addDish .content {
  background: #fafafb;
  padding: 20px;
  border: solid 1px #ccc;
  border-radius: 3px;
}
.addDishCon {
  padding: 0 20px;
  display: flex;
  line-height: 40px;
}
.addDishCon .leftCont {
  display: flex;
  border-right: solid 2px #E4E7ED;
  width: 60%;
  padding: 15px;
}
.addDishCon .leftCont .tabBut {
  width: 110px;
}
.addDishCon .leftCont .tabBut span {
  display: block;
  text-align: center;
  border-right: solid 2px #f4f4f4;
  cursor: pointer;
}
.addDishCon .leftCont .act {
  border-color: #FFC200 !important;
  color: #FFC200 !important;
}
.addDishCon .leftCont .tabList {
  flex: 1;
  padding: 15px;
}
.addDishCon .leftCont .tabList .table {
  border: solid 1px #f4f4f4;
  border-bottom: solid 1px #f4f4f4;
}
.addDishCon .leftCont .tabList .table .items {
  border-bottom: solid 1px #f4f4f4;
  padding: 0 10px;
  display: flex;
}
.addDishCon .leftCont .tabList .table .items .el-checkbox, .addDishCon .leftCont .tabList .table .items .el-checkbox__label {
  width: 100%;
}
.addDishCon .leftCont .tabList .table .items .item {
  display: flex;
  padding-right: 20px;
}
.addDishCon .leftCont .tabList .table .items .item span {
  display: inline-block;
  text-align: center;
  flex: 1;
}
.addDishCon .ritCont {
  width: 40%;
  padding: 0 15px;
}
.addDishCon .ritCont .item {
  box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #818693;
}
.addDishCon .ritCont .item span:first-child {
  text-align: left;
  color: #20232A;
}
.addDishCon .ritCont .item .price {
  display: inline-block;
  flex: 1;
}
.addDishCon .ritCont .item .del {
  cursor: pointer;
}
.addDishCon .ritCont .item .del img {
  position: relative;
  top: 5px;
  width: 20px;
}

.addDishCon .el-checkbox__label{
  width: 100%;
}
#combo-add-app .setmealFood .el-form-item__label::before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

#combo-add-app .uploadImg .el-form-item__label::before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}



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
.avatar {
  width: 178px;
  height: 178px;
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