<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <el-button icon="el-icon-arrow-left" @click="goBack">返回</el-button>
    </el-header>
    <!--页面主题区域-->
    <el-container>
      <!--侧边栏-->
      <!-- <el-aside width="200px" text-color="#fff" active-text-color="#ffd04b">Aside</el-aside>-->
      <el-aside :width="isCollapsed ? '18px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse"><<<</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapsed"
          router
          default-active="/goodslist"
        >
          <el-submenu index="2">
            <!--插槽-->
            <template slot="title">
              <!--<i class="el-icon-menu"></i>-->
              <span>司机申请</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/goodslist">申请列表</el-menu-item>
              <!--默认商品分类的路径为'/3'-->
              <el-menu-item index="3">商品分类</el-menu-item>
              <!--<el-menu-item index="goods">商品分类</el-menu-item>-->
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">商品入库</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-setting"></i>
            <span slot="title">商品出库</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #22364e;
}

.el-aside {
  background-color: #22364e;
}

.toggle-button {
  background-color: #22364e;
  text-align: right;
  color: #ffffff;
  cursor: pointer;
}
</style>