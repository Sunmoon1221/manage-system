import {request} from './request'

export function postLoginForm(data) {
	return request({
		url:'login',
		method: 'post',
		data
	})
}