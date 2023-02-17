<template>
  <div>
    <h1>你没有权限访问!</h1>
  </div>
</template>

<script>
import {checkToken} from "@/api/login";
import router from "@/router";

export default {
  name: "NotFound",
  data(){
    return{

    }
  },
  async created() {
    const res = await checkToken()

    if (String(res.code) === '1') {
      console.log("验证")

      localStorage.setItem("type", res.data.permissions)
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      localStorage.setItem('userid', String(res.data.id))
// localStorage.setItem('token',res.data.token)
      if (String(res.data.permissions)==='1'||String(res.data.permissions)==='2'){
        router.push({name:'index'})
      }else {
        if (String(res.data.storeId)==='null'){

          router.push({name:'404NotFound'})
        }else {
          router.push({name:'index'})
        }
      }
    } else {
      sessionStorage.setItem("userLastStoreId", "")
// this.$message.error(res.msg)
//此处就不提示token校验失败了，可能第一次本来就没有token
    }
  },
  methods:{

  }
}
</script>

<style scoped>

</style>