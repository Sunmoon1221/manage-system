import {request} from './request'

export function getCategories(params) {
	return request({
		url:'categories',
		params
	})
}
export function postAddCategories(data) {
	return request({
		url:'categories',
		method: 'post',
		data
	})
}
export function deleteCategories(url) {
	return request({
		url,
		method: 'delete'
	})
}
export function putEditCategories(url,data) {
	return request({
		url,
		method: 'put',
		data
	})
}
export function getCategoryById(url) {
	return request({
		url
	})
}