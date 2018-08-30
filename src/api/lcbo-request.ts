import axios from 'axios';

const ACCESS_TOKEN = 'MDpjM2MzNTVjMC1hYzcxLTExZTgtODY5Zi02NzUzYmEwNWM3NTg6RkxjcjlldE9yaWIyQWg0VXVOaTJPZWk3VVgzTFdhOHhxUWZp'

class LCBO_API {
	instance = null;

	constructor(token){
		this.instance = axios.create({
			timeout: 7000,
			baseURL: 'https://lcboapi.com',
			headers: {
				Authorization: `Token ${ACCESS_TOKEN}`
			}
		});

	}

	request(url, options = {}): Promise<any> {
		if (!url){
			return Promise.reject('Must provide valid url')
		}

		return new Promise((resolve, reject) => {
			this.instance.request(url, options)
				.then(({data}) => {
					resolve(data);
				})
				.catch(err => {
					reject(err);
				})
		})
	}
	raw(url, options): Promise<any>{
		if (!url){
			return Promise.reject('Must provide valid url')
		}

		return new Promise((resolve, reject) => {
			this.instance.request(url, options)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					// err.response has `status, data, headers, config` properties
					reject(err);
				})
		})
	}
}

export default new LCBO_API(ACCESS_TOKEN)
