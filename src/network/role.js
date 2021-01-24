import { request } from './request'

export function getRoles() {
	return request({
		url: '/roles'
	})
}
export function deleteRight(url) {
	return request({
		url,
		method: 'delete'
	})
}
export function postRole(data) {
	return request({
		url: 'roles',
		method: 'post',
		data
	})
}
export function getRoleById(url) {
	return request({
		url
	})
}
export function putEditRole(url,data) {
	return request({
		url,
		method: 'put',
		data
	})
}
export function deleteRole(url) {
	return request({
		url,
		method: 'delete',
	})
}
// 角色授权
export function postAllotRight(url,data) {
	return request({
		url,
		method: 'post',
		data
	})
}
export function putAllotRole(url,data) {
	return request({
		url,
		method: 'put',
		data
	})
}

