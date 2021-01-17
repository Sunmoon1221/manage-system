import Vue from 'vue';
import { 
	Button, 
	Select,
	Form, 
	FormItem,
	Input,
	Message} from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);

Vue.prototype.$message = Message