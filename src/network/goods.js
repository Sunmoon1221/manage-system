import {request} from './request'

export function getGoods(params) {
	return request({
		url:'goods',
		params
	})
}
export function deleteGoods(url) {
	return request({
		url,
		method: 'delete'
	})
}
export function postAddGoods(data) {
	return request({
		url:'goods',
		method: 'post',
		data
	})
}