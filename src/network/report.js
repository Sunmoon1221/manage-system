import {request} from './request'

export function getOpt() {
	return request({
		url: '/reports/type/1'
	})
}