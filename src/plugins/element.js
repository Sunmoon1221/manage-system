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
	MenuItem

} from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Container.name, Container);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Submenu.name, Submenu);

Vue.prototype.$message = Message