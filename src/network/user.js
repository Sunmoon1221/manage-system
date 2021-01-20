import {request} from './request'

// 获取用户列表
export function getUsers(params) {
	return request({
		url:'/users',
		params
	})
}
// 添加用户
export function postAddUsers(data) {
	return request({
		url:'/users',
		method:'post',
		data
	})
}
// 更改用户状态
export function putEditUserState(url) {
	return request({
		url,
		method: 'put',
	})
}
export function getUserById(url) {
	return request({
		url,
	})
}

export function putEditUser(url,data) {
	return request({
		url,
		method: 'put',
		data
	})
}