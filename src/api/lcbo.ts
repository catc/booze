import lcbo from './lcbo-request';

export interface Store {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	city: string;
}

const PAGE_SIZE = 100;
// const PAGE_SIZE = 15; // FOR TESTING

export async function search(term: string){
	const url = '/products'
	return await lcbo.request(url, {
		params: {
			q: term,
			per_page: 5
		}
	})
}

export async function getProduct(id: string){
	const url = `/products/${id}`
	return await lcbo.request(url)
}

export async function getStoreInventories(productID: string){
	let stores: Store[] = []

	// get first page
	const resp = await req(1)

	stores = stores.concat(resp.result)

	// fetch remaining pages if there are more
	if (resp.pager && resp.pager.next_page){
		const pages = resp.pager.total_pages;

		const reqs = []
		for (let i=2; i < pages+1; i++){
			reqs.push(req(i))
		}

		// combine
		const remaining = await Promise.all(reqs)
		stores = remaining.reduce((all, resp) => {
			return all.concat(resp.result)
		}, stores)
	}
	return stores;

	async function req(page: number){
		const url = '/stores';
		const params = {
			product_id: productID,
			per_page: PAGE_SIZE,
			page: page
		}
		return lcbo.request(url, { params })
	}
}
