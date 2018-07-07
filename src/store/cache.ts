
interface Store {
	id: string;
	name: string;
	latitude: string;
	longitude: string;
	city: string;
}

class StoreCache {
	stores: {[id: string]: Store}  = {}

	add(store: Store){
		if (!this.stores[store.id]){
			this.stores[store.id] = store;
		}
	}
}

export default new StoreCache()