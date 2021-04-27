<template>
  <div class="login_container">
    <!--白底框架-->
    <div class="login_box">
      <!--logo图片-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--登录表单区域-->
      <!--ref="loginformref" 定义表单对象-->
      <el-form
        :model="loginform"
        :rules="loginformrules"
        ref="loginformref"
        label-width="0px"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="businessname">
          <el-input
            v-model="loginform.businessname"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <!--prop验证生效-->
        <el-form-item prop="businesspassword">
          <el-input
            v-model="loginform.businesspassword"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//	import { Button } from "element-ui";
//	import 'element-ui/lib/theme-chalk/index.css'

export default {
  data() {
    return {
      //login表单的数据绑定
      loginform: {
        businessname: "",
        businesspassword: "",
      },
      //验证规则
      loginformrules: {
        businessname: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur",
          },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10个字符",
            trigger: "blur",
          },
        ],
        businessname: [
          {
            required: true,
            message: "请输入用户密码",
            trigger: "blur",
          },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮
    resetloginform() {
      // 				console.log(this)
      //				ref注册引用信息
      //resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginformref.resetFields();
    },
    // //点击登录按钮
    // login() {
    //   this.$refs.loginformref.validate(async (valid) => {
    //     if (!valid) return;
    //     const { data: res } = await this.$axios.post(
    //       "/businessLogin/login",
    //       this.loginform
    //     );
    //     if (res.code !== 200) return this.$Message.error("登录失败！");
    //     this.$Message.success("登录成功！");
    //     console.log(res);

    //     this.$router.push("/home");
    //   });
    // },
    //点击登录按钮
    login() {
      this.$refs.loginformref.validate(async (valid) => {
        if (!valid) return;
        await this.$axios
          .post("/businessLogin/login", this.loginform, {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          })
          .then((Response) => {
            console.log(Response);
            const res = Response.data;
            if (res.code !== 200) return this.$Message.error(res.msg);
            this.$Message.success("登录成功！");
            localStorage.setItem("token", res.token);
            console.log(res);
            this.$router.push("/home");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  background-color: #fff;
}
/*logo图片外框*/

.avatar_box {
  width: 130px;
  height: 130px;
  /*边框*/
  border: 1px solid #eee;
  /*画圆弧*/
  border-radius: 50%;
  /*内边距*/
  padding: 10px;
  /*阴影指的是x,y以及阴影模糊度*/
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  /*平移*/
  transform: translate(-50%, -50%);
  background-color: #fff;
  /*logo图片*/
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  /*绝对定位*/
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  input {
    width: 100%;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.inputstyle {
  width: 90%;
}
</style>