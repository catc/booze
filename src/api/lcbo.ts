import lcbo from './lcbo-request';
import stores from 'store/cache';

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

// TODO - support pagination
export async function getStoreInventories(productID: string){
	const url = '/inventories'
	return await lcbo.request(url, {
		params: {
			product_id: productID,
			per_page: 15
		}
	})
}

export async function getStore(storeID: string){
	const url = `/stores/${storeID}`
	const store = await lcbo.request(url)
	// LEFT OFF HERE
}

export async function getStores(stores: string[]){
	const url = '/stores'
	return await lcbo.request(url, {
		params: {
			// product_id: productID
			per_page: 200
		}
	})
}