<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-left">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goodslist' }">商品管理</a>
			</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!--卡片视图区-->
		<el-card>
			<!--搜索与添加窗口-->
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入用户id" v-model="queryInfo.id">
						<!--slot 插槽 选择放置搜索栏的先后顺序-->
						<el-button slot="append" icon="el-icon-search" @click="getgoodslist"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
				</el-col>
			</el-row>
			<!--用户列表区域-->
			<!--border 边框 v-bind:data="goodslist"简写为：data="goodslist"指的是属性绑定 数据在data中
				v-on:click=""简写为@click="" 指的是事件绑定 方法在methods中
				v-model 数据双向绑定
				stripe隔行变色
			-->
			<el-table :data="goodslist" border stripe>

				<!--索引列-->
				<!--prop 对应列内容的字段名-->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="用户id" prop="id"></el-table-column>
				<el-table-column label="用户名称" prop="cus_name"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight"></el-table-column>
				<el-table-column label="商品价格" prop="price"></el-table-column>
				<el-table-column label="日期" prop="date"></el-table-column>
				<el-table-column label="操作">
					<!--slot-scope作用域插槽拿到scope对象-->
					<template slot-scope="scope">
						<!--修改-->
						<el-tooltip class="item" effect="dark" content="修改" placement="top">
							<el-button type="primary" icon="el-icon-edit" circle @click="showEditDiaolog(scope.row.id)"></el-button>
						</el-tooltip>

						<!--删除-->
						<el-tooltip class="item" effect="dark" content="删除" placement="top">
							<el-button type="danger" icon="el-icon-delete" circle @click="removeGoodsById(scope.row.id)"></el-button>
						</el-tooltip>

					</template>
				</el-table-column>
			</el-table>
			<!--分页区域   size-change页面有多少条数据 current-change选择当前页码-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum" :page-sizes="[3, 5, 8, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!--添加商品的对话框-->
		<el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!--内容主体区域  addForm 指的添加用户表单 ref指的是引用-->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
				<!--prop 验证规则  label-width指的是文本宽度-->
				<el-form-item label="用户名称" prop="cus_name">
					<el-input v-model="addForm.cus_name"></el-input>
				</el-form-item>
				<el-form-item label="商品名称" prop="goods_name">
					<el-input v-model="addForm.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品重量" prop="goods_weight">
					<el-input v-model="addForm.goods_weight"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-input v-model="addForm.price"></el-input>
				</el-form-item>

			</el-form>
			<!--底部区域-->
			<span slot="footer" class="dialog-footer">
  				 <el-button @click="addDialogVisible = false">取 消</el-button>
   				 <el-button type="primary" @click="addGoods">确 定</el-button>
  		</span>
		</el-dialog>
		<!--修改商品对话框-->
		<el-dialog title="修改商品" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!--:rules="editFormRules" ref="editFormRef"  -->
			<!-- 修改商品名称的规则，使用添加商品的规则-->
			<el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
				<el-form-item label="用户名称">
					<el-input v-model="editForm.cus_name" disabled></el-input>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="editForm.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品重量" prop="goods_weight">
					<el-input v-model="editForm.goods_weight"></el-input>
				</el-form-item>
				<el-form-item label="商品价格" prop="price">
					<el-input v-model="editForm.price"></el-input>
				</el-form-item>
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
			var checkNumber = (rule, value, callback) => {
				const regNumber = /^\d+(\.\d+)?$/
				if(regNumber.test(value)) {
					return callback()
				}
				callback(new Error("请输入合法数字！"))
			}

			return {
				//获取用户列表的参数
				queryInfo: {
					//查询参数
					id: '',
					//当前页数
					pageNum: 1,
					//当前每页显示多少条
					pageSize: 3
				},
				goodslist: [],
				total: 0,
				//控制对话框的显示与隐藏
				addDialogVisible: false,
				//添加用户表单数据
				addForm: {
					cus_name: '',
					goods_name: '',
					goods_weight: '',
					price: ''
				},
				//添加用户表单规则
				addFormRules: {
					//对应prop
					cus_name: [{
						required: true,
						message: '请输入用户名称',
						//验证时机，即鼠标离开焦点的时候触发
						trigger: 'blur'
					}],
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						//验证时机，即鼠标离开焦点的时候触发
						trigger: 'blur'
					}],
					goods_weight: [{
							required: true,
							message: '请输入商品重量',
							//验证时机，即鼠标离开焦点的时候触发
							trigger: 'blur'
						},
						{
							validator: checkNumber,
							trigger: 'blur'
						}
					],
					price: [{
						required: true,
						message: '请输入商品价格',
						//验证时机，即鼠标离开焦点的时候触发
						trigger: 'blur'
					},
						{
							//验证输入是否为数字
							validator: checkNumber,
							trigger: 'blur'
						}
					]
				},
				//修改规则验证
				editFormRules: {
				
					goods_weight: [{
							required: true,
							message: '请输入商品重量',
							//验证时机，即鼠标离开焦点的时候触发
							trigger: 'blur'
						},
						{
							//验证输入是否为合格数字
							validator: checkNumber,
							trigger: 'blur'
						}
					],
						price: [{
							required: true,
							message: '请输入商品价格',
							//验证时机，即鼠标离开焦点的时候触发
							trigger: 'blur'
						},
						{
							//验证输入是否为正确数字
							validator: checkNumber,
							trigger: 'blur'
						}
					]

				},
				//控制对话框的修改与隐藏
				editDialogVisible: false,
				//查询到的商品信息对象
				editForm: {
					id: '',
					cus_name: '',
					goods_name: '',
					goods_weight: '',
					price: ''
				}

			}
		},
		created() {
			this.getgoodslist()

		},
		methods: {
			async getgoodslist() {
				const {
					data: res
				} = await this.$http.get('/order/searchByIdAndPage', {
					params: this.queryInfo
				})
				console.log(res)
				if(res.code != 200) {
					return this.$Message.error("获取用户数据失败")
				}
				this.goodslist = res.data
				this.total = res.total
			},

			//监听pagesize改变的事件，指的是每页展示多少条数据
			handleSizeChange(newSize) {
				console.log(newSize)
				this.queryInfo.pageSize = newSize
				this.getgoodslist()
			},
			//监听页码值,指的是具体选择哪一页
			handleCurrentChange(newPage) {
				console.log(newPage)
				this.queryInfo.pageNum = newPage
				this.getgoodslist()
			},
			//监听添加商品对话框的关闭事件
			addDialogClosed() {
				//调用addFormRef引用的reset方法实现表单重置
				this.$refs.addFormRef.resetFields()
			},
			addGoods() {
				//=>箭头指的是回调函数
				//箭头函数接受校验结果 也就是增加商品之前进行预校验 返回valid值为true或者false
				this.$refs.addFormRef.validate(async valid => {
					console.log(valid)
					//校验失败直接返回不添加商品
					if(!valid) return
					//返回为true则向浏览器发送真正的添加商品的请求
					const {
						data: res
					} = await this.$http.post('/order/', this.addForm)
					if(res.code != 200) {
						this.$message.error("添加商品失败！")
					}
					this.$message.success("添加商品成功！")
					this.addDialogVisible = false
					this.getgoodslist()
				})
			},

			//修改商品对话框
			async showEditDiaolog(id) {
				console.log(id)
				const {
					data: res
				} = await this.$http.get('/order/?id=' + id)
				if(res.code != 200) {
					this.$message.error("查询商品失败！")
				}
				this.editForm = res.data[0]
				console.log(res.data[0])
				this.editDialogVisible = true
			},
			//监听修改用户对话框的关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			//修改商品信息并提交
			editGoodsInfo() {
				//validate校验是否成功
				this.$refs.editFormRef.validate(async valid => {
					//				console.log(valid)
					//					预验证失败则直接返回，
					if(!valid) return
					//否则发起数据修改请求
					const {
						data: res
					} = await this.$http.patch('/order/', this.editForm)
					if(res.code != 200) {
						return this.$message.error("更新用户失败")
					}
					//1.关闭对话框
					this.editDialogVisible = false
					//2.刷新数据列表
					this.getgoodslist()
					//3.提示修改成功
					this.$Message.success("更新商品信息成功！")
				})

			},
			//根据id删除信息
			async removeGoodsById(id) {
				//弹框提示
				const confirmResult = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).catch(err => err)
				//确认删除返回值为confirm，取消返回cancel
				console.log(confirmResult)
				if(confirmResult != "confirm") return this.$message.info('已取消删除')
				const {
					data: res
				} = await this.$http.delete('/order/' + id)
				if(res.code != 200) return this.$Message.ERROR("删除用户失败！")
				this.$Message.success("删除成功！")
				this.getgoodslist()
			}
		}
	}
</script>

<style lang="less" scoped>

</style>