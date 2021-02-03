import {request} from './request'

export function getOrders(params) {
	return request({
		url:'orders',
		params
	})
}

export function getLogi() {
	return request({
		url:'/kuaidi/1106975712662'
	})
}