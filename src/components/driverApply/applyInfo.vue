<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-left">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/applyInfo' }">申请列表</a>
			</el-breadcrumb-item>
		
		</el-breadcrumb>

		<!--卡片视图区-->
		<el-card>
			<!--搜索与添加窗口-->
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入用户id" v-model="queryInfo.id">
						<!--slot 插槽 选择放置搜索栏的先后顺序-->
						<el-button slot="append" icon="el-icon-search" @click="getApplyList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">申请出/入园</el-button>
				</el-col>
			</el-row>
			<!--用户列表区域-->
			<!--border 边框 v-bind:data="applylist"简写为：data="applylist"指的是属性绑定 数据在data中
				v-on:click=""简写为@click="" 指的是事件绑定 方法在methods中
				v-model 数据双向绑定
				stripe隔行变色
			-->
			<el-table :data="applylist" border stripe>

				<!--索引列-->
				<!--prop 对应列内容的字段名-->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="id" prop="id"></el-table-column>
				<el-table-column label="司机姓名" prop="drivername"></el-table-column>
				<el-table-column label="司机身份证号" prop="cardnumber"></el-table-column>
				<el-table-column label="司机电话" prop="telphone"></el-table-column>
				<el-table-column label="申请入/出园" prop="driverapplytype"></el-table-column>
				<el-table-column label="申请状态" prop="driverapplystatus"></el-table-column>
				<el-table-column label="车型" prop="drivercartype"></el-table-column>
				<el-table-column label="车牌号" prop="drivercarnumber"></el-table-column>
				<el-table-column label="预约日期" prop="applydate"></el-table-column>
				<el-table-column label="操作">
					<!--slot-scope作用域插槽拿到scope对象-->
					<template slot-scope="scope">
						<!--修改-->
						<el-tooltip class="item" effect="dark" content="修改" placement="top">
							<el-button type="primary" icon="el-icon-edit" circle @click="showEditDiaolog(scope.row.id)"></el-button>
						</el-tooltip>

						<!--删除-->
						<el-tooltip class="item" effect="dark" content="删除" placement="top">
							<el-button type="danger" icon="el-icon-delete" circle @click="removeGoodsById(scope.row)"></el-button>
						</el-tooltip>

					</template>
				</el-table-column>
			</el-table>
			<!--分页区域   size-change页面有多少条数据 current-change选择当前页码-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum" :page-sizes="[5, 8, 10,15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!--添加申请的对话框-->
		<el-dialog title="添加申请" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!--内容主体区域  addForm 指的添加申请表单 ref指的是引用-->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
				<!--prop 验证规则  label-width指的是文本宽度-->
				<el-form-item label="司机id" prop="driverid">
					<el-input v-model="addForm.driverid"></el-input>
				</el-form-item>
                <el-form-item label="车牌号" prop="drivercarnumber">
					<el-input v-model="addForm.drivercarnumber"></el-input>
				</el-form-item>
                <el-form-item label="入/出园" prop="driverapplytype" >
				 <el-select v-model="addForm.driverapplytype" style="width:100%;">
                            <el-option label="出园" value="1"></el-option>
                            <el-option label="入园" value="2"></el-option>
                </el-select>
				</el-form-item>
				<el-form-item label="车型" prop="drivercartype" >
					 <el-select v-model="addForm.drivercartype" style="width: 100%;">
                            <el-option label="卡车" value="1"></el-option>
                            <el-option label="货车" value="2"></el-option>
                            <el-option label="汽车" value="3"></el-option>
                </el-select>
				</el-form-item>
				<el-form-item label="预约日期"  >
					 <el-date-picker v-model="addForm.applydate" type="date" placeholder="选择日期" style="width: 50%;">
           </el-date-picker>
                     <el-select  v-model="addForm.applytime"  placeholder="请选择时段" style="width: 50%;">
                       <el-option label="6:00-9:00" value="1"></el-option>
                       <el-option label="9:00-12:00" value="2"></el-option>
                       <el-option label="12:00-15:00" value="3"></el-option>
                       <el-option label="15:00-18:00" value="4"></el-option>
                     </el-select>
				</el-form-item>
			</el-form>
			<!--底部区域-->
			<span slot="footer" class="dialog-footer">
  				 <el-button @click="addDialogVisible = false">取 消</el-button>
   				 <el-button type="primary" @click="addGoods">确认</el-button>
  		</span>
		</el-dialog>
		<!--修改商品对话框-->
		<el-dialog title="审核申请信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!--:rules="editFormRules" ref="editFormRef"  -->
			<!-- 修改商品名称的规则，使用添加商品的规则-->
			<el-form :model="editForm" ref="editFormRef" label-width="70px">

                	<!--prop 验证规则  label-width指的是文本宽度-->
				<el-form-item label="司机id" prop="driverid">
					<el-input v-model="editForm.driverid" disabled></el-input>
				</el-form-item>
				<el-form-item label="出/入园" prop="driverapplytype">
					<el-input v-model="editForm.driverapplytype" disabled></el-input>
				</el-form-item>
				<el-form-item label="车类型" prop="drivercartype">
					<el-input v-model="editForm.drivercartype" disabled></el-input>
				</el-form-item>
				<el-form-item label="车牌号" prop="drivercarnumber">
					<el-input v-model="editForm.drivercarnumber" disabled></el-input>
				</el-form-item>
			
				<!-- <el-form-item label="预约日期" prop="applydate">
					<el-input v-model="editForm.applydate" disabled ></el-input>
				</el-form-item> -->
        <el-form-item label="预约日期"  >
					 <el-date-picker v-model="editForm.applydate" type="date" placeholder="选择日期" style="width: 50%;">
           </el-date-picker>
                     <el-select  v-model="editForm.applytime"  placeholder="请选择时段" style="width: 50%;">
                       <el-option label="6:00-9:00" value="1"></el-option>
                       <el-option label="9:00-12:00" value="2"></el-option>
                       <el-option label="12:00-15:00" value="3"></el-option>
                       <el-option label="15:00-18:00" value="4"></el-option>
                     </el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
   					<el-button @click="editDialogVisible = false">取 消</el-button>
    					<el-button type="primary" @click="editGoodsInfo">同意</el-button>
  			</span>
		</el-dialog>
		<!--删除用户弹窗-->
	</div>
</template>

<script>
export default {
  data() {
    //验证是否为数字
    var checkPhoneNumber = (rule, value, callback) => {
      const regNumber = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (regNumber.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号！"));
    };
    //验证身份证号码
    var checkIdCardNumber = (rule, value, callback) => {
      // 加权因子
      var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验码
      var check_code = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

      var code = value + "";
      var last = value[17]; //最后一位

      var seventeen = code.substring(0, 17);

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split("");
      var len = arr.length;
      var num = 0;
      for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i];
      }

      // 获取余数
      var resisue = num % 11;

      var last_no = check_code[resisue];

      // 格式的正则
      // 正则思路
      /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
      var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
      if (idcard_patter.test(value) && (last === last_no ? true : false)) {
        return callback();
      }
      callback(new Error("请输入合法身份证号！"));
    };
    //验证是否为数字
    var checkNumber = (rule, value, callback) => {
      const regNumber = /^\d+(\.\d+)?$/;
      if (regNumber.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法数字！"));
    };

    return {
      selectApplyType: "",
      //获取用户列表的参数
      queryInfo: {
        id: null,
        //当前页数
        pageNum: 1,
        //当前每页显示多少条
        pageSize: 10,
      },
      applylist: [],
      total: 0,
      //控制对话框的显示与隐藏
      addDialogVisible: false,
      //添加司机申请出/入园表单数据
      addForm: {
        // drivername: "",
        // driveridnumber: "",
        // driverphone: "",
        driverid: "",
        driverapplytype: "",
        drivercartype: "",
        drivercarnumber: "",
        applytime: "",
        createby: "商务录入",
        driverapplystatus: "0",
        applydate: "",
      },
      //添加司机申请出/入园表单规则
      addFormRules: {
        //对应prop
        driverid: [
          {
            required: true,
            message: "请输入用户名称",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        driveridnumber: [
          {
            required: true,
            message: "请输入身份证号",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
          {
            validator: checkIdCardNumber,
            trigger: "blur",
          },
        ],
        driverphone: [
          {
            required: true,
            message: "请输入手机号码",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
          {
            validator: checkPhoneNumber,
            trigger: "blur",
          },
        ],
        drivercarnumber: [
          {
            required: true,
            message: "请输入车牌号",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        drivercarnumber: [
          {
            required: true,
            message: "请输入车牌号",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        drivercarnumber: [
          {
            required: true,
            message: "请输入车牌号",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        driverapplytype: [
          {
            required: true,
            message: "请选择出入园",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        drivercartype: [
          {
            required: true,
            message: "请选择车类型",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        applytime: [
          {
            required: true,
            message: "请选择日期",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        contracttime: [
          {
            required: true,
            message: "请选择预约时段",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
      },
      //控制对话框的修改与隐藏
      editDialogVisible: false,
      //查询到的商品信息对象
      editForm: {
        driverid: "",
        driverapplytype: "",
        drivercartype: "",
        drivercarnumber: "",
        applydate: "",
        applytime: "",
      },
    };
  },
  created() {
    this.getApplyList();
  },
  methods: {
    async getApplyList() {
      await this.$http
        .post("/applyInfo/AllDriverApplyInfo", this.queryInfo, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
        .then((Response) => {
          console.log(this.queryInfo);
          console.log("获取数据");
          console.log(Response.data);
          const res = Response.data;
          if (res.code != 200) {
            return this.$Message.error("获取司机申请信息失败");
          }
          this.applylist = res.data.list;
          for (var i = 0; i < this.applylist.length; i++)
            this.applylist[i].applydate += " " + this.applylist[i].applytime;
          this.total = res.data.total;
        })
        .catch((Error) => {
          console.log(Error);
        });
    },

    //监听pagesize改变的事件，指的是每页展示多少条数据
    handleSizeChange(newSize) {
      console.log("指的是每页展示多少条数据");
      console.log(newSize);
      this.queryInfo.pageSize = newSize;
      this.getApplyList();
    },
    //监听页码值,指的是具体选择哪一页
    handleCurrentChange(newPage) {
      console.log("指的是具体选择哪一页");
      console.log(newPage);
      this.queryInfo.pageNum = newPage;
      this.getApplyList();
    },
    //监听添加申请对话框的关闭事件
    addDialogClosed() {
      //调用addFormRef引用的reset方法实现表单重置
      this.$refs.addFormRef.resetFields();
    },
    addGoods() {
      //=>箭头指的是回调函数
      //箭头函数接受校验结果 也就是增加商品之前进行预校验 返回valid值为true或者false
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        //校验失败直接返回不添加申请
        if (!valid) return;
        //返回为true则向浏览器发送真正的添加商品的请求
        const { data: res } = await this.$http.post(
          "/applyInfo/insertDriverApplyInfo",
          this.addForm,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          }
        );
        console.log("________________");
        console.log(res);
        if (res.code != 200) {
          this.$message.error(res.msg);
        } else {
          this.$message.success("添加申请成功！");
        }
        this.addDialogVisible = false;
        this.getApplyList();
      });
    },

    //审核信息对话框
    async showEditDiaolog(id) {
      console.log("获取用户id");
      console.log(id);
      await this.$http
        .get("/applyInfo/selectApplyInfoById/?id=" + id, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
        .then((Response) => {
          const res = Response.data;
          if (res.code != 200) {
            this.$message.error("查询信息失败！");
          }
          console.log(res.data);
          this.editForm = res.data;
          console.log(this.editForm);
          this.editDialogVisible = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //确认审核申请信息
    editGoodsInfo() {
      console.log("确认审核申请信息");
      // this.editForm.driverapplystatus = 1;
      console.log(this.editForm);
      console.log("修改前的日期");
      const d = new Date(this.editForm.applydate);
      const resDate =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      this.editForm.applydate = resDate;
      console.log(this.editForm.applydate);
      //validate校验是否成功
      this.$refs.editFormRef.validate(async (valid) => {
        //				console.log(valid)
        //					预验证失败则直接返回，
        if (!valid) return;
        //否则发起数据修改请求
        await this.$http
          .patch("/applyInfo/updateApplyInfo", this.editForm, {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          })
          .then((Response) => {
            const res = Response.data;
            console.log("修改后的日期");
            // console.log(res.applydate);
            console.log(res);
            if (res.code != 200) return this.$message.error(res.msg);
            //3.提示修改成功
            this.$Message.success("信息已审核！");
          })
          .catch((error) => {
            console.log(error);
          });

        //1.关闭对话框
        this.editDialogVisible = false;
        //2.刷新数据列表
        this.getApplyList();
      });
    },

    //根据id删除信息
    async removeGoodsById(applyInfo) {
      console.log(applyInfo);
      // console.log(id);

      // applyInfo.applydate = new Date(
      //   Date.parse(applyInfo.applydate).format("yyyy-MM-dd")
      // );
      // var str = applyInfo.applydate.substring(0, 10);
      // applyInfo.applydate = new Date(str);
      // //  var dataStr=myDate.getFullYear()+"-"+ (myDate.getMonth()+1) +"-"+myDate.getDate();
      // console.log(applyInfo.applydate);
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该记录, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((err) => err);
      //确认删除返回值为confirm，取消返回cancel
      console.log(confirmResult);
      if (confirmResult != "confirm") return this.$message.info("已取消删除");
      applyInfo.driverapplystatus = "-1";
      // applyInfo.applydate = applyInfo.applydate.substring(0, 10);
      const { data: res } = await this.$http.patch(
        "/applyInfo/deleteApplyInfoById",
        applyInfo,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.code != 200) return this.$Message.error("删除用户失败！");
      this.$Message.success("删除成功！");
      this.getApplyList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>