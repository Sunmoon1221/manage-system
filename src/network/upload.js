import { request } from './request'

export function postUploadPicture(data) {
	return request({
		url: '/upload',
		method: 'post',
		data
	})
}