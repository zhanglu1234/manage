<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-left">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/driver' }">司机列表</a>
			</el-breadcrumb-item>
		
		</el-breadcrumb>

		<!--卡片视图区-->
		<el-card>
			<!--搜索与添加窗口-->
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入司机id" v-model="queryInfo.id">
						<!--slot 插槽 选择放置搜索栏的先后顺序-->
						<el-button slot="append" icon="el-icon-search" @click="getClientList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<!-- <el-button type="primary" @click="addDialogVisible = true">添加司机信息</el-button> -->
				</el-col>
			</el-row>
			<!--用户列表区域-->
			<!--border 边框 v-bind:data="clientlist"简写为：data="clientlist"指的是属性绑定 数据在data中
				v-on:click=""简写为@click="" 指的是事件绑定 方法在methods中
				v-model 数据双向绑定
				stripe隔行变色
			-->
			<el-table :data="clientList" border stripe>

				<!--索引列-->
				<!--prop 对应列内容的字段名-->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="司机id" prop="id"></el-table-column>	
				<el-table-column label="司机姓名" prop="drivername"></el-table-column>
				<el-table-column label="司机性别" prop="gender"></el-table-column>
        <el-table-column label="司机手机号码" prop="telphone"></el-table-column>
				<el-table-column label="司机身份证号码" prop="cardnumber"></el-table-column>
				<el-table-column label="司机驾驶证证件" prop="pictureurl"></el-table-column>
				<el-table-column label="操作">
					<!--slot-scope作用域插槽拿到scope对象-->
					<template slot-scope="scope">
						<!--修改-->
						<el-tooltip class="item" effect="dark" content="修改" placement="top">
							<el-button type="primary" icon="el-icon-edit" circle @click="showEditDiaolog(scope.row.id)"></el-button>
						</el-tooltip>

						<!--删除-->
						<el-tooltip class="item" effect="dark" content="删除" placement="top">
							<el-button type="danger" icon="el-icon-delete" circle @click="removeClientById(scope.row.id)"></el-button>
						</el-tooltip>

					</template>
				</el-table-column>
			</el-table>
			<!--分页区域   size-change页面有多少条数据 current-change选择当前页码-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum" :page-sizes="[5, 8, 10,15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!--添加申请的对话框-->
		<el-dialog title="添加司机信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!--内容主体区域  addForm 指的添加申请表单 ref指的是引用-->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
				<!--prop 验证规则  label-width指的是文本宽度-->
			
				<el-form-item label="司机姓名" prop="drivername">
					<el-input v-model="addForm.drivername"></el-input>
				</el-form-item>
				<el-form-item label="司机性别" prop="gender">
					<el-input v-model="addForm.gender"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="telphone">
					<el-input v-model="addForm.clientname"></el-input>
				</el-form-item>
				<el-form-item label="身份证号码" prop="cardnumber">
					<el-input v-model="addForm.telphone"></el-input>
				</el-form-item>
        	<el-form-item label="驾驶证" prop="pictureurl">
					<el-input v-model="addForm.pictureurl"></el-input>
				</el-form-item>
			
			</el-form>
			<!--底部区域-->
			<span slot="footer" class="dialog-footer">
  				 <el-button @click="addDialogVisible = false">取 消</el-button>
   				 <el-button type="primary" @click="addClient">确 定</el-button>
  		</span>
		</el-dialog>
		<!--修改商品对话框-->
		<el-dialog title="修改客户信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!--:rules="editFormRules" ref="editFormRef"  -->
			<!-- 修改商品名称的规则，使用添加商品的规则-->
			<el-form :model="editForm" ref="editFormRef" label-width="70px">

                	<!--prop 验证规则  label-width指的是文本宽度-->
			<el-form-item label="司机id" prop="id">
					<el-input v-model="editForm.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="司机姓名" prop="drivername">
					<el-input v-model="editForm.drivername" disabled></el-input>
				</el-form-item>
        <el-form-item label="司机性别" prop="gender" >
					<el-input v-model="editForm.gender" disabled></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="telphone">
					<el-input v-model="editForm.telphone"></el-input>
				</el-form-item>
				<el-form-item label="身份证件" prop="cardnumber">
					<el-input v-model="editForm.cardnumber"></el-input>
				</el-form-item>
        <el-form-item label="驾驶证件" prop="pictureurl">
					<el-input v-model="editForm.pictureurl"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
   					<el-button @click="editDialogVisible = false">取 消</el-button>
    					<el-button type="primary" @click="editClientInfo">确 定</el-button>
  			</span>
		</el-dialog>
		<!--删除用户弹窗-->
	</div>
</template>

<script>
export default {
  data() {
    //验证手机号码是否正确
    var checkPhoneNumber = (rule, value, callback) => {
      const regNumber = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (regNumber.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号！"));
    };

    return {
      //获取用户列表的参数
      queryInfo: {
        id: null,
        //当前页数
        pageNum: 1,
        //当前每页显示多少条
        pageSize: 10,
      },
      clientList: [],
      total: 0,
      //控制对话框的显示与隐藏
      addDialogVisible: false,
      //添加司机申请出/入园表单数据
      addForm: {
        drivername: "",
        gender: "",
        telphone: "",
        cardnumber: "",
        pictureurl: "",
      },
      //添加司机申请出/入园表单规则
      addFormRules: {
        //对应prop
        drivername: [
          {
            required: true,
            message: "请输入客户账号",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "请输入客户密码",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        cardnumber: [
          {
            required: true,
            message: "请输入客户姓名",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
        ],
        telphone: [
          {
            required: true,
            message: "请输入客户手机号码",
            //验证时机，即鼠标离开焦点的时候触发
            trigger: "blur",
          },
          {
            validator: checkPhoneNumber,
            trigger: "blur",
          },
        ],
      },
      //控制对话框的修改与隐藏
      editDialogVisible: false,
      //查询到的客户信息
      editForm: {
        id: "",
        drivername: "",
        gender: "",
        telphone: "",
        cardnumber: "",
        pictureurl: "",
      },
    };
  },
  created() {
    this.getClientList();
  },
  methods: {
    async getClientList() {
      await this.$http
        .post("/driverInfo/AllDriverInfoByManage", this.queryInfo, {
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
          this.clientList = res.data.list;
          this.total = res.data.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //监听pagesize改变的事件，指的是每页展示多少条数据
    handleSizeChange(newSize) {
      console.log("指的是每页展示多少条数据");
      console.log(newSize);
      this.queryInfo.pageSize = newSize;
      this.getClientList();
    },
    //监听页码值,指的是具体选择哪一页
    handleCurrentChange(newPage) {
      console.log("指的是具体选择哪一页");
      console.log(newPage);
      this.queryInfo.pageNum = newPage;
      this.getClientList();
    },
    //监听添加商品对话框的关闭事件
    addDialogClosed() {
      //调用addFormRef引用的reset方法实现表单重置
      this.$refs.addFormRef.resetFields();
    },
    addClient() {
      //=>箭头指的是回调函数
      //箭头函数接受校验结果 也就是增加商品之前进行预校验 返回valid值为true或者false
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        //校验失败直接返回不添加申请
        if (!valid) return;
        //返回为true则向浏览器发送真正的添加商品的请求
        const { data: res } = await this.$http.post(
          "/driverInfo/insertDriverInfo",
          this.addForm,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          }
        );
        if (res.code != 200) {
          this.$Message.error("添加用户失败！");
        }
        this.$Message.success("添加用户成功！");
        this.addDialogVisible = false;
        this.getClientList();
      });
    },

    //修改客户信息对话框
    async showEditDiaolog(id) {
      console.log("获取订单号ordernumber");
      console.log(id);
      await this.$http
        .get("/driverInfo/selectDriverInfoById/?id=" + id, {
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
    //修改商品信息并提交
    editClientInfo() {
      //validate校验是否成功
      this.$refs.editFormRef.validate(async (valid) => {
        //				console.log(valid)
        //					预验证失败则直接返回，
        if (!valid) return;
        //否则发起数据修改请求
        await this.$http
          .patch("/driverInfo/updateDriverInfo", this.editForm, {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
          })
          .then((Response) => {
            const res = Response.data;
            console.log(res);
            if (res.code != 200) {
              return this.$message.error("更新用户失败");
            }
          })
          .catch((error) => {
            console.log(error);
          });

        //1.关闭对话框
        this.editDialogVisible = false;
        //2.刷新数据列表
        this.getClientList();
        //3.提示修改成功
        this.$Message.success("更新订单信息成功！");
      });
    },
    //根据订单号删除信息
    async removeClientById(id) {
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
      const { data: res } = await this.$http.delete(
        "/driverInfo/deleteClientInfo?id=" + id,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.code != 200) return this.$Message.error("删除用户失败！");
      this.$Message.success("删除成功！");
      this.getClientList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>