<template>
  <div class="dashboard-container" id="food-app">
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
            placeholder="请输入菜品名称"
            style="width: 250px"
            clearable
            @clear="cleanQuery"
            @keyup.enter.native="handleQuery"
        >
          <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
              @click="init"
          ></i>
        </el-input>
        <div class="tableLab">
          <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
          <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
          <span style="border:none;" class="span-btn delBut non" @click="statusHandle('0')">批量停售</span>
          <el-button
              type="primary"
              @click="addFoodtype('add')"
          >
            + 新建菜品
          </el-button>
        </div>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
          v-loading="foodtableloading"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="25"
        ></el-table-column>
        <el-table-column
            prop="name"
            label="菜品名称"
            width="90"
        ></el-table-column>
        <el-table-column prop="image" label="图片" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"
                      :src="row.image"
                      :preview-src-list="[ `${row.image}` ]" >
              <div slot="error" class="image-slot">
/*                <img style="width: auto; height: 40px; border:none;" >*/
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="categoryName"
            label="菜品分类"
            width="120"
        ></el-table-column>
        <el-table-column label="售价" width="120">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">￥{{ scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态" width="100">
          <template slot-scope="scope">
            <span :style="String(scope.row.status) === '0'? 'color: red;margin-right: 10px;': 'color: #0c56dc;margin-right: 10px;'">{{ scope.row.status == '0' ? '停售' : '启售' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="排序" width="60">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{scope.row.sort}}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="updateTime"
            label="最后操作时间"
        >
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
                @click="addFoodtype(scope.row)"
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
      <div>
        <el-dialog
            :title="classData.title"
            :visible.sync="classData.dialogVisible"
            width="80%"
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
              label-width="180px"
              class="demo-classData"
          >
            <div>
              <el-form-item
                  label="菜品名称:"
                  prop="name"
              >
                <el-input
                    v-model="classData.name"
                    placeholder="请填写菜品名称"
                    maxlength="20"
                />
              </el-form-item>
              <el-form-item label="菜品分类：" prop="categoryId">
                <el-select v-model="classData.categoryId" placeholder="请选择">
                  <el-option
                      v-for="item in categoryIdoptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item
                  label="菜品价格:"
                  prop="price"
              >
                <el-input
                    v-model="classData.price"
                    placeholder="请设置菜品价格"
                />
              </el-form-item>
              <el-form-item label="排序：">
                <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
              </el-form-item>
              <el-tag type="success">默认按照排序从小到大排序,出现重复则按名称首字母从小到大</el-tag>
            </div>
            <el-form-item label="口味做法配置:">
              <el-form-item>
                <div class="flavorBox">
              <span
                  v-if="dishFlavors.length == 0"
                  class="addBut"
                  @click="addFlavore"
              > + 添加口味</span>
                  <div
                      v-if="dishFlavors.length != 0"
                      class="flavor"
                  >
                    <div class="title">
                      <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                    </div>
                    <div class="cont">
                      <div
                          v-for="(item, index) in dishFlavors"
                          :key="index"
                          class="items"
                      >
                        <div class="itTit">
                          <!-- <SelectInput
                            :dish-flavors-data="dishFlavorsData"
                            :index="index"
                            :value="item.name"
                            @select="selectHandle"
                          /> -->
                          <div class="selectInput">
                            <div>
                              <el-input
                                  v-model="item.name"
                                  type="text"
                                  style="width: 100%;text-align: center;"
                                  placeholder="请输入口味"
                                  @focus="selectFlavor(true,index)"
                                  @blur="outSelect(false,index)"
                              />
                            </div>
                            <div v-show="item.showOption" class="flavorSelect">
                              <el-button
                                  type="primary" plain
                                  v-for="(it, ind) in dishFlavorsData"
                                  :key="ind"
                                  class="items"

                                  @click="checkOption(it,ind,index)"
                              >{{ it.name }}
                              </el-button>
                              <span
                                  v-if="dishFlavorsData == []"
                                  class="none">无数据
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                            class="labItems"
                            style="display: flex"
                        >
                      <span
                          v-for="(it, ind) in item.value"
                          :key="ind"
                      >{{ it }} <i @click="delFlavorLabel(index, ind)">X</i></span>
                          <div
                              class="inputBox"
                              :style="inputStyle"
                              contenteditable="true"
                              @focus="flavorPosition(index)"
                              @keydown.enter="(val)=>keyDownHandle(val,index)"
                          ></div>
                          <!--                              :style="inputStyle"-->
                        </div>
                        <span
                            class="delFlavor delBut non"
                            @click="delFlavor(index)"
                        >删除</span>
                      </div>
                    </div>
                    <div
                        class="addBut"
                        @click="addFlavore"
                    >
                      添加口味
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form-item>
            <div>
            </div>
            <div>
              <el-form-item
                  label="菜品图片:"
                  prop="region"
                  class="uploadImg"
              >
                <!--必须加header，不然后端会拦截-->
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
            <div class="address">
              <el-form-item
                  label="菜品描述:"
                  prop="region"
              >
                <el-input
                    v-model="classData.description"
                    type="textarea"
                    :rows="3"
                    placeholder="菜品描述，最长200字"
                    maxlength="200"
                />
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
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/login";
import * as imageConversion from 'image-conversion';

export default {
  name: "food",
  data() {
    return {
      headerObj: {
        Authorization: localStorage.getItem('token'),
        userid:localStorage.getItem('userid')
      },
      input: '',
      counts: 0,
      page: 1,
      pageSize: 5,
      tableData : [],
      dishState : '',
      checkList: [],
      foodtableloading:false,
      userInfo: {},
      token:'',
      isAdmin:false,
      storeIdoptions:[],
      storeNamevalue:'',//StoreNamevalue
      storeIdvalue:'',//当前选择器的storeId
      categoryIdoptions:[],
      classData: {
        id:'',//id
        title: '新建菜品',
        dialogVisible: false,
        foodId: '',
        name: '',//菜品名
        sort: '',//排序
        status:'1',//默认上架
        categoryId:'',
        price:'',
        image:'',//url
        description:'',//描述
        version:'',//版本号
      },
      statusoptions:[{
        label:"上架",
        value:"1"
      },
        {
          label:"停售",
          value:"0"
        }],
      action:'',
      imageUrl: '',
      dishList: [],
      dishFlavorsData: [],
      inputStyle  : {'flex':1},

      dishFlavors: [],//要传服务器的口味
      // 图片的base编码
      imgBase64: '',
      // 水印配置项
      waterMakeConfig: {
        font: 'microsoft yahei', //字体
        //水印文本内容
        textArray: ['rg'],
      },
      isimageupload:false,//图片是否再上传
    }
  },
  computed: {
    rules () {
      return {
        'name': [
          {'required': true, 'message': '请填写菜品名称', 'trigger': 'blur'}
        ],
        'categoryId': [
          {'required': true, 'message': '请选择菜品分类', 'trigger': 'change'}
        ],
        'price': [
          {
            'required': true,
            // 'message': '请填写菜品价格',
            validator: (rules, value, callback) => {
              if (!value) {
                callback(new Error('请填写菜品价格'))
              } else {
                const reg = /^\d+(\.\d{0,2})?$/
                if (reg.test(value)) {
                  if(value < 10000){
                    callback()
                  }else{
                    callback(new Error('菜品价格小于10000'))
                  }
                } else {
                  callback(new Error('菜品价格格式只能为数字,且最多保留两位小数'))
                }
              }
            },
            'trigger': 'blur'
          }
        ],
      }
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
      const res = await Api.getCategoryLableValueList(String(this.storeIdvalue),String('1'));//菜品type为1,在套餐页面只需要'1'改为'2'
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

      this.foodtableloading = true
      this.getFlavorListHand()
      // const params = {
      //   page: this.page,
      //   pageSize: this.pageSize,
      //   name: this.input ? this.input : undefined
      // }
      const res = await Api.getFoodList(this.page,this.pageSize,this.storeIdvalue,this.input ? this.input : undefined)
      if (String(res.code)==='1'){
        this.tableData = res.data.records || []
        this.counts = Number(res.data.total)
      }else {
        this.$message.error(res.msg)
      }
      this.foodtableloading = false

      // await getDishPage(params).then(res => {
      //   if (String(res.code) === '1') {
      //     this.tableData = res.data.records || []
      //     this.counts = res.data.total
      //   }
      // }).catch(err => {
      //   this.$message.error('请求出错了：' + err)
      // })
    },
    getImage (image) {
      return `/common/download?name=${image}`
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
    addFoodtype (st) {
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
        this.classData.title = '新增菜品'
        this.classData.dialogVisible = true
      } else {
        this.action = 'edit'
        this.classData.title = '编辑菜品'
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

        this.getFoodFlavor(st.id)
        this.classData.dialogVisible = true
      }
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
      this.$confirm('确认删除该菜品, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(async () => {
        const res = await Api.deleteDish(params)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },

    //状态更改
    statusHandle (row) {
      let params = {}
      if (typeof row === 'string' ) {
        if (this.checkList.length === 0) {
          this.$message.error('批量操作，请先勾选操作菜品！')
          return false
        }
        params.id = this.checkList.join(',')
        params.status = row
      } else {
        params.id = row.id
        params.status = String(row.status)==='1' ? '0' : '1'
      }
      this.dishState = params
      this.$confirm('确认更改该菜品状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        // 起售停售---批量起售停售接口
        const res = await Api.dishStatusByStatus(this.dishState)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error('请求出错了：' + res.msg)
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
      console.log(val)
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      if (val>(Number(this.counts)/Number(this.pageSize))+1){
        this.$message.info("最大页了")
        return
      }
      this.page = val
      this.init()
    },
    checkOption(val, ind, index){
      this.selectHandle(val.name, index, ind)
      this.dishFlavors[index].name = val.name
    },
    addFlavore () {
      this.dishFlavors.push({'name': '', 'value': [], showOption: false}) // JSON.parse(JSON.stringify(this.dishFlavorsData))
    },
    // 按钮 - 删除口味
    delFlavor (ind) {
      this.dishFlavors.splice(ind, 1)
    },
    // 按钮 - 删除口味标签
    delFlavorLabel (index, ind) {
      this.dishFlavors[index].value.splice(ind, 1)
    },
    //口味位置记录
    flavorPosition (index) {
      this.index = index
    },
    // 添加口味标签
    keyDownHandle (val,index) {
      console.log('keyDownHandle----val',val)
      console.log('keyDownHandle----index',index)
      console.log('keyDownHandle----this.dishFlavors',this.dishFlavors)
      if (event) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
      }
      if (val.target.innerText.trim() != '') {
        this.dishFlavors[index].value.push(val.target.innerText)
        val.target.innerText = ''
      }
    },
    // 获取口味列表
    getFlavorListHand () {
      // flavor flavorData
      this.dishFlavorsData = [
        {'name':'甜味','value':['无糖','少糖','半糖','多糖','全糖']},
        {'name':'温度','value':['热饮','常温','去冰','少冰','多冰']},
        {'name':'忌口','value':['不要葱','不要蒜','不要香菜','不要辣']},
        {'name':'辣度','value':['不辣','微辣','中辣','重辣']}
      ]
    },
    cleanform(){
      this.classData.sort=''
      this.classData.name=''
      this.classData.image=''
      this.imageUrl = ''
      this.classData.price=''
      this.classData.description=''
      this.classData.categoryId=''

      this.dishFlavors = []//清空口味

      // this.classData.categoryId = ''
    },
    selectFlavor(st,index){
      console.log('st',st)
      console.log('index',index)
      console.log('this.dishFlavors',this.dishFlavors)
      const obj = JSON.parse(JSON.stringify(this.dishFlavors[index]))
      obj.showOption = st
      this.dishFlavors.splice(index,1,obj)
      // this.dishFlavors[index].showOption = st
    },

    outSelect(st,index){
      const _this = this
      setTimeout(()=> {
        const obj = JSON.parse(JSON.stringify(_this.dishFlavors[index]))
        obj.showOption = st
        _this.dishFlavors.splice(index,1,obj)
      }, 200)
    },
    // inputHandle(val,index){
    //   // this.selectFlavor(false,index)
    //   // console.log(val,index)
    // },
    cancel(){
      this.cleanform()
      this.classData.dialogVisible = false
    },
    selectHandle(val, key, ind){
      const arrDate = [...this.dishFlavors]
      arrDate[key] = JSON.parse(JSON.stringify(this.dishFlavorsData[ind]))
      this.dishFlavors = arrDate
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
        //compressAccurately有多个参数时传入对象
        //imageConversion.compressAccurately(file, {
        // size: 1024, //图片大小压缩到1024kb
        // width:1280 //宽度压缩到1280
        //}).then(res => {
        //resolve(res)
        //})
      });
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
    async submitForm(st) {
      if ((st === 'go')&&this.action==='add') {
        //继续添加
        //添加
        console.log(this.dishFlavors)
        const res = await Api.addDish(this.classData.name, this.classData.categoryId, String(this.classData.price), this.classData.image, this.classData.description, String(this.classData.status), String(this.classData.sort), this.storeIdvalue, this.dishFlavors)
        if (String(res.code)==='1'){
          console.log(res)
          this.$message.success(res.msg)
          this.cleanform()
        }else {
          this.$message.error(res.msg)
        }
      } else {
        //添加
        if (this.action==='add'){
          console.log(this.dishFlavors)
          const res = await Api.addDish(this.classData.name, this.classData.categoryId, String(this.classData.price), this.classData.image, this.classData.description, String(this.classData.status), String(this.classData.sort), this.storeIdvalue, this.dishFlavors)
          if (String(res.code)==='1'){
            console.log(res)
            this.$message.success(res.msg)
            this.cleanform()
            this.handleQuery()
            this.dialogVisible = false
          }else {
            this.$message.error(res.msg)
          }
        }else if (this.action==='edit'){
          console.log("edit")
          const res = await Api.editDish(this.classData.name, this.classData.categoryId, String(this.classData.price), this.classData.image, this.classData.description, String(this.classData.status), String(this.classData.sort), this.storeIdvalue, this.dishFlavors,String(this.classData.id),String(this.classData.version))
          if (String(res.code)==='1'){
            console.log(res)
            this.$message.success(res.msg)
            this.cancel()
            this.handleQuery()

          }else {
            this.$message.error(res.msg)
          }

        }

      }
    },
    async getFoodFlavor(id) {
      let params = {}
      params.id = String(id)
      const res = await Api.getDishFlavor(params)
      if (String(res.code)==='1'){
        this.dishFlavors = res.data
        console.log(res.data.length)
        for (var i=0;i<res.data.length;i++){

          var str = res.data[i].value
          console.log("0:"+str)
          str = str.replace(/\[|]/g,'')
          console.log("1:"+str)
          this.dishFlavors[i].value = str.split(", ")
          console.log("2:"+this.dishFlavors[i].value)
        }

        // this.dishFlavors.value = JSON.parse(res.data.value)
      }
    },
  }
}
</script>

<style scoped>

.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
}
.selectInput .flavorSelect {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  border-radius: 3px;
  border: solid 1px #807974;
  line-height: 30px;
  text-align: center;
  background: rgba(255, 255, 255, 0.98);
  top: 50px;
  z-index: 99;
}
.selectInput .flavorSelect .items {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  line-height: 15px;
  /*border-bottom: solid 1px #a85151;*/
  /*color: #383737;*/
  /*padding: 1px 1px 1px 1px;*/
}
.selectInput .flavorSelect .none {
  font-size: 14px;
}

#food-add-app .uploadImg .el-form-item__label::before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
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
.xuanzeqi {
  padding: 5px 10px 5px 10px;
  margin: 0px 3px 15px 13px;
  /*border: rgba(162, 156, 156, 0.47) 1px solid;*/
  /*border-radius: 10px;*/
}
</style>