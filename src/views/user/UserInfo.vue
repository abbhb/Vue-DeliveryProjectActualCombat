<template>
<div>
  <el-card class="box-card">
    <el-form :model="form" label-width="120px">
      <el-form-item :rules="[{ required: true, message: '用户名 is required' },]" label="用户名">
        <el-input v-model="form.username" disabled=""/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '昵称 is required' },]" label="昵称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '性别 is required' },]" label="性别">
        <el-select v-model="form.gender" placeholder="请选择你的性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item :rules="[
        { required: true, message: 'age is required' },
        { type: 'number', message: 'age must be a number' },
      ]" label="年龄">
        <el-input type="number" v-model="form.age" />
      </el-form-item>
      <el-form-item   :rules="[
        { required: true, message: 'email is required' },
      ]"  label="email">
        <el-input v-model="form.email" />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled="(form_serve.age === form.age)&&(form_serve.name === form.name)&&(form_serve.gender === form.gender)&&(form_serve.email === form.email) ? true:false">更新</el-button>
        <el-button @click="reWrite">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
import * as Api from "@/api/login";



export default {
  name: "UserInfo",
  data(){
    return{
      form:{
        username:'',
        name: '',
        gender: '',
        age: 1,
        email:'',
      },
      form_serve:{
        username:'',
        name: '',
        gender: '',
        age: 1,
        email:'',
      },
      userInfo:{},
    };
  },
  created() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo){
      this.userInfo = JSON.parse(userInfo)
      this.form.name = this.userInfo.name
      this.form_serve.name = this.userInfo.name
      //注意用户名不能有重复
    }
  },
  methods:{
    reWrite(){
      if (sessionStorage.name){
        this.form.name = this.form_serve.name
      }
      if (sessionStorage.username){
        this.form.username = this.form_serve.username
      }
      if (sessionStorage.gender){
        this.form.gender = this.form_serve.gender
      }
      if (sessionStorage.age){
        this.form.age = this.form_serve.age
      }
      if (sessionStorage.email){
        this.form.email = this.form_serve.email
      }
    },
    async onSubmit() {
      var that = this
      const data = await Api.updataforuser(that.form.name, that.form.age, that.form.gender, that.form.email);
      if (data.status===200){
        that.$message.success(data.msg);
        that.form_serve.email = that.form.email;
        that.form_serve.age = that.form.age;
        that.form_serve.name = that.form.name;
        that.form_serve.gender = that.form.gender;


        const res = await checkToken()
        if (String(res.code) === '1'){
          localStorage.setItem('userInfo',JSON.stringify(res.data))
          // localStorage.setItem('token',res.data.token)
          router.push({name:'index'})
        }else {
          this.$message.error(res.msg)
        }
      }
    }
  }
}
</script>

<style scoped>
.box-card{
  width: 50rem;
}
</style>