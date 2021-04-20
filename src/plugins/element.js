import Vue from 'vue'
import {Button,
	Form,
	FormItem,
	Input,
	Message,
	Container,
	Header,
	Aside,
	Main,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
    Status,
	Table,
	TableColumn,
	Tooltip,
	Pagination,
	Dialog,
	MessageBox}
from 'element-ui'

//全局导入
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

Vue.prototype.$Message = Message
//原型挂载
Vue.prototype.$MessageBox = MessageBox.confirm