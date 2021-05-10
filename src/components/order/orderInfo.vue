<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-left">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/order' }">订单列表</a>
			</el-breadcrumb-item>
		
		</el-breadcrumb>

		<!--卡片视图区-->
		<el-card>
			<!--搜索与添加窗口-->
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入订单号" v-model="queryInfo.orderNumber">
						<!--slot 插槽 选择放置搜索栏的先后顺序-->
						<el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
					</el-input>
				</el-col>
				<!-- <el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">申请出/入园</el-button>
				</el-col> -->
			</el-row>
			<!--用户列表区域-->
			<!--border 边框 v-bind:data="OrderList"简写为：data="OrderList"指的是属性绑定 数据在data中
				v-on:click=""简写为@click="" 指的是事件绑定 方法在methods中
				v-model 数据双向绑定
				stripe隔行变色
			-->
			<el-table :data="orderList" border stripe>

				<!--索引列-->
				<!--prop 对应列内容的字段名-->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="订单号" prop="ordernumber"></el-table-column>	
				<el-table-column label="缴费金额" prop="payment"></el-table-column>
				<el-table-column label="是否缴费" prop="paymentstatus"></el-table-column>
				<el-table-column label="缴费时间" prop="paymenttime"></el-table-column>
				<el-table-column label="车牌号" prop="ordercarnumber"></el-table-column>
				<el-table-column label="客户账号" prop="clientuniqueid"></el-table-column>
				<el-table-column label="司机姓名" prop="drivername"></el-table-column>
        <el-table-column label="订单状态" prop="orderstatus"></el-table-column>
        <el-table-column label="预约时间" prop="datetime"></el-table-column>
				<el-table-column label="操作">
					<!--slot-scope作用域插槽拿到scope对象-->
					<template slot-scope="scope">
						<!--修改-->
						<el-tooltip class="item" effect="dark" content="关联客户" placement="top">
							<el-button type="primary" icon="el-icon-edit" circle @click="showEditDiaolog(scope.row.ordernumber)"></el-button>
						</el-tooltip>

						<!--删除-->
						<el-tooltip class="item" effect="dark" content="无效订单" placement="top">
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

		<!--关联客户信息对话框-->
		<el-dialog title="关联客户信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!--:rules="editFormRules" ref="editFormRef"  -->
			<!-- 修改商品名称的规则，使用添加商品的规则-->
			<el-form :model="editForm" ref="editFormRef" label-width="70px">
      	<!--prop 验证规则  label-width指的是文本宽度-->
				<el-form-item label="订单号" prop="ordernumber">
					<el-input v-model="editForm.ordernumber" disabled></el-input>
				</el-form-item>
				<el-form-item label="缴费金额" prop="payment">
					<el-input v-model="editForm.payment" disabled></el-input>
				</el-form-item>
        <el-form-item label="缴费状态" prop="paymentstatus">
					<el-input v-model="editForm.paymentstatus" disabled></el-input>
				</el-form-item>
				<el-form-item label="缴费时间" prop="paymenttime">
					<el-input v-model="editForm.paymenttime" disabled></el-input>
				</el-form-item>
        	<el-form-item label="司机id" prop="orderdriverinfoid">
					<el-input v-model="editForm.orderdriverinfoid" disabled></el-input>
				</el-form-item>
				<el-form-item label="客户id" prop="orderclientid">
					<el-input v-model="editForm.orderclientid"></el-input>
				</el-form-item>	
			<!-- <el-form-item label="订单状态" prop="orderstatus">
					<el-input v-model="editForm.orderstatus" ></el-input>
				</el-form-item>  -->
			</el-form>
			<span slot="footer" class="dialog-footer">
   					<el-button @click="editDialogVisible = false">取 消</el-button>
    					<el-button type="primary" @click="editGoodsInfo">确 定</el-button>
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
      orderstatus: "",
      //获取用户列表的参数
      queryInfo: {
        orderNumber: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条
        pageSize: 10,
      },
      orderList: [],
      total: 0,
      //控制对话框的修改与隐藏
      editDialogVisible: false,
      //查询到的商品信息对象
      editForm: {
        ordernumber: "",
        orderstatus: "",
        payment: "",
        // paymentstatus: "",
        paymenttime: "",
        eventtype: "",
        ordercarnumber: "",
        orderclientId: "",
        orderdriverinfoId: "",
        datetime: "",
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      await this.$http
        .post("/order/getAllOrderInfo", this.queryInfo, {
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
            return this.$Message.error("获取用户数据失败");
          }
          this.orderList = res.data.list;
          console.log(this.getOrderList);
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
      this.getOrderList();
    },
    //监听页码值,指的是具体选择哪一页
    handleCurrentChange(newPage) {
      console.log("指的是具体选择哪一页");
      console.log(newPage);
      this.queryInfo.pageNum = newPage;
      this.getOrderList();
    },
    //监听添加商品对话框的关闭事件
    addDialogClosed() {
      //调用addFormRef引用的reset方法实现表单重置
      this.$refs.addFormRef.resetFields();
    },

    //修改订单对话框
    async showEditDiaolog(ordernumber) {
      console.log("获取订单号ordernumber");
      console.log(ordernumber);
      await this.$http
        .get("/order/getOrderInfoByOrderNumber/?orderNumber=" + ordernumber, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
        .then((Response) => {
          const res = Response.data;
          if (res.code != 200) {
            this.$message.error("查询订单失败！");
          }
          console.log(res.data);
          this.editForm = res.data;

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
    //绑定客户信息
    editGoodsInfo() {
      // 订单有效1，订单无效-1 订单状态默认为1

      //validate校验是否成功
      this.$refs.editFormRef.validate(async (valid) => {
        //				console.log(valid)
        //					预验证失败则直接返回，
        if (!valid) return;
        //否则发起数据修改请求
        await this.$http
          .patch("/order/updateOrderInfo", this.editForm, {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          })
          .then((Response) => {
            const res = Response.data;
            console.log(res);
            if (res.code != 200) return this.$message.error(res.msg);

            this.$Message.success("更新订单信息成功！");
          })
          .catch((error) => {
            console.log(error);
          });

        //1.关闭对话框
        this.editDialogVisible = false;
        //2.刷新数据列表
        this.getOrderList();
        //3.提示修改成功
      });
    },
    //根据订单号无效信息
    async removeGoodsById(orderInfo) {
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将删除订单, 是否继续?",
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
      orderInfo.orderstatus = -1;
      const { data: res } = await this.$http.patch(
        "/order/deleteOrderInfo",
        orderInfo,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      if (res.code != 200) return this.$Message.error("删除订单失败！");
      this.$Message.success("删除成功！");
      this.getOrderList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>