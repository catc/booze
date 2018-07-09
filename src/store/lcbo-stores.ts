
export interface Store {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	city: string;
}

class StoreCache {
	stores: {[id: string]: Store}  = {}

	add(store: Store){
		if (!this.stores[store.id]){
			this.stores[store.id] = store;
		}
	}

	get(storeID: string){
		return this.stores[storeID]
	}
}

export default new StoreCache()
