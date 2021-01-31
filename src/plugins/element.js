import Vue from 'vue';
import {
	Button,
	Select,
	Form,
	FormItem,
	Input,
	Message,
	Container,
	Aside,
	Main,
	Menu,
	Submenu,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	Pagination,
	Row,
	Col,
	Dialog,
	MessageBox,
	Tag,
	Tree,
	Option,
	Cascader,
	Alert,
	Tabs,
	TabPane,
	Steps,
	Step,
	CheckboxGroup,
	Checkbox,
	Upload


} from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Container.name, Container);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Submenu.name, Submenu);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Card.name, Card);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Switch.name, Switch);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Pagination.name, Pagination);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Dialog.name, Dialog);
Vue.component(Tag.name, Tag);
Vue.component(Tree.name, Tree);
Vue.component(Cascader.name, Cascader);
Vue.component(Alert.name, Alert);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(TabPane.name, TabPane);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Upload.name, Upload);

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm