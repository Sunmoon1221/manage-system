import {request} from './request'

export function getParams(url,params) {
	return request({
		url,
		params
	})
}
export function postAddParams(url,data) {
	return request({
		url,
		method: 'post',
		data
	})
}
export function deleteParams(url) {
	return request({
		url,
		method: 'delete'
	})
}
export function getParamsById(url,params) {
	return request({
		url,
		params
	})
}
export function putEditParams(url,data) {
	return request({
		url,
		method: 'put',
		data
	})
}
