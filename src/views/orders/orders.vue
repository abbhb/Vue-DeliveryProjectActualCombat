<template>
  <div class="dashboard-container" id="mendian-app">
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
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >
        <el-table-column
            prop="id"
            label="订单号"
            width="90"
        ></el-table-column>
        <el-table-column
            prop="orderTime"
            label="下单时间"
        >
        </el-table-column>
        <el-table-column
            prop="consignee"
            label="收货人"
            width="90"
        ></el-table-column>

        <el-table-column
            prop="address"
            label="收货地址"
            width="120"
            show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
            width="120"
        ></el-table-column>

        <el-table-column
            label="支付方式"
            width="120"
        >
          <template slot-scope="scope">
            <span style="margin-right: 10px;" v-if="String(scope.row.payMethod)==='2'">支付宝</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.payMethod)==='1'">微信支付</span>
          </template>
        </el-table-column>
        <el-table-column
            label="付款状态"
            width="120"
        >
          <template slot-scope="scope">
            <span style="margin-right: 10px;" v-if="String(scope.row.payStatus)==='2'">已付款</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.payStatus)==='1'">未付款</span>
          </template>
        </el-table-column>
        <el-table-column label="实收金额" width="120">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="订单状态"
            width="120"
        >
          <template slot-scope="scope">
            <span style="margin-right: 10px;" v-if="String(scope.row.orderStatus)==='2'">待派送</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.orderStatus)==='1'">未支付</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.orderStatus)==='3'">派送中</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.orderStatus)==='4'">已完成</span>
            <span style="margin-right: 10px;" v-else-if="String(scope.row.orderStatus)==='5'">已取消</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="statusRemark"
            label="状态备注"
            width="120"
        ></el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            width="120"
        ></el-table-column>

<!--        <el-table-column label="售价" width="120">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="margin-right: 10px;">￥{{ scope.row.price}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->

<!--        <el-table-column label="售卖状态" width="100">-->
<!--          <template slot-scope="scope">-->
<!--            <span :style="String(scope.row.status) === '0'? 'color: red;margin-right: 10px;': 'color: #0c56dc;margin-right: 10px;'">{{ scope.row.status == '0' ? '停售' : '启售' }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->




        <el-table-column
            prop="checkoutTime"
            label="付款时间"
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
                v-if="String(scope.row.orderStatus)==='1'"
                type="text"
                size="small"
                class="delBut non"
                @click="changeOrdersSta(scope.row,5)"
            >
              取消订单
            </el-button>
            <el-button
                v-else-if="String(scope.row.orderStatus)==='2'"
                type="text"
                size="small"
                class="delBut non"
                @click="changeOrdersSta(scope.row,3)"
            >
              派送
            </el-button>
            <el-button
                v-else-if="String(scope.row.orderStatus)==='3'"
                type="text"
                size="small"
                class="delBut non"
                @click="changeOrdersSta(scope.row,4)"
            >
              已送达(模拟)
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
import * as Api from "@/api/login";

export default {
  name: "orders",
  data(){
    return{
      counts: 0,
      page: 1,
      pageSize: 5,
      isAdmin:false,
      storeIdoptions:[],
      storeNamevalue:'',//StoreNamevalue
      storeIdvalue:'',//当前选择器的storeId
      tableData:[{
        id:"123412345235233434",
        orderTime:"2023-02-03 20:30:12",
        consignee:"桃桃",
        address:"地址测试",
        phone:"13988884444",
        payMethod:"2",
        payStatus:"2",
        amount:"12.33",
        orderStatus:"2",
        statusRemark:"12312312312312",
        remark:"w3erw234rt234tw34",
        checkoutTime:"2023-02-03 20:30:12"
      },{
        id:"123412345235233434",
        orderTime:"2023-02-03 20:30:12",
        consignee:"桃桃",
        address:"地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试地址测试",
        phone:"13988884444",
        payMethod:"2",
        payStatus:"2",
        amount:"12.33",
        orderStatus:"2",
        statusRemark:"12312312312312",
        remark:"w3erw234rt234tw34",
        checkoutTime:"2023-02-03 20:30:12"
      },{
        id:"123412345235233434",
        orderTime:"2023-02-03 20:30:12",
        consignee:"桃桃",
        address:"地址测试",
        phone:"13988884444",
        payMethod:"2",
        payStatus:"2",
        amount:"12.33",
        orderStatus:"2",
        statusRemark:"12312312312312",
        remark:"w3erw234rt234tw34",
        checkoutTime:"2023-02-03 20:30:12"
      },],

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
  methods: {
    changeOrdersSta(row,sta){
      console.log("=====================")
      console.log("开始改变")
      console.log(row)
      console.log(sta)
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
      this.getListForAdmin();
    },
    async getListForAdmin() {
      const res = await Api.listForAdmin(this.page,this.pageSize,this.storeIdvalue);
      if (String(res.code)==='1'){
        // console.log(res)
        this.tableData = res.data.records
        this.counts = Number(res.data.total)
      }else {
        this.$message.error(res.msg)
      }
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
  }
}
</script>

<style scoped>

</style>