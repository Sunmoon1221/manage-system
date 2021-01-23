import {request} from './request'

export function getMenus() {
	return request({
		url: '/menus'
	})
}
export function getAllRightList(url) {
	return request({
		url
	})
}

