import Vue from 'vue'
import { Button, Form, FormItem, Input, Message,Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn,Switch,Tooltip,Pagination ,Dialog, MessageBox, Tag, Tree, Option,Select, Cascader,Alert,Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox,Upload} from 'element-ui'

// 导入时间线

import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.prototype.$message = Message //element中的message组件需要全局挂载
Vue.prototype.$confirm = MessageBox.confirm; //弹出确认框需要全局挂载