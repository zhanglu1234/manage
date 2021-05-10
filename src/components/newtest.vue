<template>
  <div style="margin-top: 15px">
    <el-select
      v-model="selectCarType"
      slot="prepend"
      placeholder="请选择车类型"
    >
      <el-option label="卡车" value="1"></el-option>
      <el-option label="汽车" value="2"></el-option>
      <el-option label="货车" value="3"></el-option>
    </el-select>
    <el-select
      v-model="selectApplyType"
      slot="prepend"
      placeholder="请选择出/入园"
    >
      <el-option label="出园" value="1"></el-option>
      <el-option label="入园" value="2"></el-option>
    </el-select>
    <el-date-picker v-model="applytime" type="date" placeholder="选择日期">
    </el-date-picker>
    <el-select v-model="selectTime" slot="prepend" placeholder="请选择时段">
      <el-option label="6:00-9:00" value="1"></el-option>
      <el-option label="9:00-12:00" value="2"></el-option>
      <el-option label="12:00-15:00" value="3"></el-option>
      <el-option label="15:00-18:00" value="4"></el-option>
    </el-select>
  </div>
</template>


<script>
export default {
  data() {
    return {
      selectCarType: "",
      selectApplyType: "",
      applytime: "",
      selectTime: "",
    };
  },
  methods: {},
};
</script>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>