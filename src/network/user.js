import {request} from './request'

export function getUsers(params) {
	return request({
		url:'/users',
		params
	})
}
export function putEditUser(url) {
	return request({
		url,
		method: 'put',
	})
}