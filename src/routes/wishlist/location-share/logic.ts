
import { Store, Product } from 'api/lcbo'

export type groups = groups

// check if the selected products can all be found in the same store
export function containsAllProducts(groups: groups, totalProducts: number): string | undefined {
    return Object.keys(groups).find(groupStr => groupStr.split(',').length === totalProducts)
}


// converts group ids to group names for rendering
export function listGroups(groups: groups, productsMap: { [productID: number]: Product }): { [groupStr: string]: string[] } {
    const g: { [groupStr: string]: string[] } = {}
    for (let groupStr in groups) {
        const products = groupStr.split(',').map((productID: string) => {
            return productsMap[productID].name
        })
        g[groupStr] = products
    }
    return g;
}

// check which stores have at least 2+ of the products selected
export function generateGroups(hash: { [productID: number]: Store[] }): groups {
    const storesMap: { [storeID: number]: string[] } = {}

    // map of store ids to array of products
    for (let productID in hash) {
        for (let store of hash[productID]) {
            const storeID = store.id
            if (storesMap[storeID]) {
                storesMap[storeID].push(productID)
            } else {
                storesMap[storeID] = [productID]
            }
        }
    }

    // group product ids to array of common stores
    const groups: groups = {}
    for (let storeID in storesMap) {
        if (storesMap[storeID].length < 2) {
            // only products that share at least 1 store
            continue
        }
        const composite = storesMap[storeID].sort().join(',')
        if (!groups[composite]) {
            groups[composite] = []
        }
        groups[composite].push(storeID)
    }

    return groups;
}

export function mapStoresToProducts(
    groups: groups,
    key: string,
    productsToStore: { [productID: number]: Store[] },
    productsMap: { [productID: number]: Product }): StoreData[]
{

    const group = groups[key]
    const products = key.split(',')

    // create map of product to store to easy lookup of quantities
    const productToStoreMap: { [productID: string]: { [storeID: string]: Store } } = {}
    for (let productID of products) {
        const storeMap: { [storeID: string]: Store } = {}
        for (let store of productsToStore[productID]) {
            storeMap[store.id] = store
        }
        productToStoreMap[productID] = storeMap
    }

    // loop through each store, add store data and product quantities
    return group.map(storeID => {
        let data: StoreData = { quantities: [] }

        for (let productID of products) {
            // add quantities per product per store
            const store = productToStoreMap[productID][storeID]
            data.quantities.push([
                productsMap[productID].name,
                store.quantity
            ])

            // add store data
            if (!data.id) {
                data = Object.assign(data, store)
            }
        }
        return data;
    })
}