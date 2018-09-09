import lcbo from './lcbo-request';
import random from 'lodash/random';

export interface Product {
	id: number;
	name: string;
	origin: string;
	description: string;
	producer_name: string;
	package: string;
	alcohol_content: number;
	is_dead: boolean;
	is_discontinued: boolean;
	price_in_cents: number;
	regular_price_in_cents: number;
	style: string;
	image_url: string;
	image_thumb_url: string;
	tasting_note: string;
	serving_suggestion: string;
	varietal: string;
}

export interface TruncatedProduct {
	id: number;
	name: string;
	image_thumb_url: string;
	price_in_cents: number;
	package: string;
}

export interface Store {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	city: string;
	quantity: number;
	address_line_1: string;
	address_line_2: string;
	telephone: string;
}

export interface ProductPager {
	next_page: undefined | number;
	total_record_count: number;
}

const TOTAL_PRODUCT_ITEMS = 12852 // retrieved from api
const RANDOM_PAGE_SIZE = 24
const MAX_PRODUCT_PAGES = Math.floor(TOTAL_PRODUCT_ITEMS / RANDOM_PAGE_SIZE)

const PAGE_SIZE = 50;

// const PAGE_SIZE = 15; // FOR TESTING

export async function search(term: string, page: number = 1){
	const url = '/products'
	return await lcbo.request(url, {
		params: {
			q: term,
			per_page: 12,
			page
			// TODO - investigate if can see dead + discontinued stuff
			// , where: 'is_dead'
		}
	})
}

export async function randomProducts() {
	const url = '/products'
	return await lcbo.request(url, {
		params: {
			per_page: 12 * 2,
			page: random(1, MAX_PRODUCT_PAGES)
		}
	})
}

export async function getProduct(id: number): Promise<{ result: Product }>{
	const url = `/products/${id}`
	return await lcbo.request(url)
}

export async function getStoreInventories(productID: number){
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
	return stores.filter(s => s.quantity > 0);

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
