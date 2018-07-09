import lcbo from './lcbo-request';
import storesCache, { Store } from 'store/lcbo-stores';

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

	// TODO - start fetching stores immediately here
}

// fetch all stores by ids
export async function getStores(storeIDs: string[]){
	try {
		const reqs = storeIDs.map(id => getStore(id))
		return await Promise.all(reqs)
	} catch (err){
		console.error('Error fetching stores', err)
	}
}

async function getStore(storeID: string): Store {
	// if already cached, use cache
	let s = storesCache.get(storeID)
	if (s){
		return store;
	}

	// otherwise fetch
	try {
		const url = `/stores/${storeID}`
		const resp = await lcbo.request(url)
		if (resp.status !== 200){
			throw new Error(resp)
		}
		storesCache.add(resp.result)
		return resp.result;
	} catch (err){
		console.error('Error fetching store', err)
	}
}
