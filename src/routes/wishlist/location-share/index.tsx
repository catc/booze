import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import intersection from 'lodash/intersection'

import { getStoreInventories, Store, Product } from 'api/lcbo'

/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class LocationCheck extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetch()
    }

    fetch = async () => {
        // get ids of selected products
        const reqs = this.props.selected
            .map(p => p.id)
            .reduce((hash, id) => {
                hash[id] = getStoreInventories(id)
                return hash
            }, {})

        try {
            // get stores for all inventories
            const stores = await Promise.hash(reqs)

            // check which products are available in the same store
            this.analyse(stores)
        } catch (err){
            console.error('Error fetching inventories for stores', err)
        }
    }

    // storeMap: { [storeID: string]: Store } = {}

    // check which stores have at least 2+ of the products selected
    analyse(hash: { [id: string]: Store[] }){
        // map of store ids to store
        // const storeMap: {[storeID: string]: Store} = {}
        const productIDs = Object.keys(hash)
        
        // convert each array of stores to set of store ids
        type productIDsToStoreIDsSet = {[productID: string]: Set<number>};
        const productToStoreIDs: productIDsToStoreIDsSet = productIDs.reduce((obj, productID) => {
            const stores = hash[productID]
            // cache store in map
            const storeIDs = stores.map((s: Store) => s.id)
            /* const storeIDs = stores.map((s: Store) => {
                // storeMap[s.id] = s
                return s.id
            }) */
            obj[productID] = new Set(storeIDs)
            return obj
        }, {})
        // this.storeMap = storeMap;

        const storesSearched: {[key: number]: boolean} = {}

        // compare stores of all products
        const shared = productIDs.reduce((m, productID) => {
            const stores = productToStoreIDs[productID]

            stores.forEach(storeID => {
                if (storesSearched[storeID]) {
                    // already accounted for store
                    return;
                }

                // check every other set of stores to see
                // if it contains the store id as well
                const products = [];
                productIDs.forEach(otherProductID => {
                    if (otherProductID !== productID) {
                        const otherProductStores = productToStoreIDs[otherProductID]
                        if (otherProductStores.has(storeID)) {
                            products.push(otherProductID)
                        }
                    }
                })

                // add the store to the product group
                if (products.length){
                    products.unshift(productID)

                    const productGroupKey = products.join(',')
                    if (!m.has(productGroupKey)) {
                        m.set(productGroupKey, [])
                    }
                    m.get(productGroupKey).push(storeID)
                }

                // don't search the store again
                storesSearched[storeID] = true;
            })

            return m
        }, new Map())
        /* 
            format of `shared` is:
            {
                "productID,productID": [storeID, storeID],
                "productID,productID,productID": [storeID, storeID],
            }
        */

        this.handleShared(shared)
    }

    @computed get productMap(): {[productID: string]: Product} {
        return this.props.selected.reduce((obj, product) => {
            obj[product.id] = product
            return obj
        }, {})
    }

    handleShared(shared: Map<string, number[]>){
        console.log('ok shared are', shared)

        const productGroups = [...shared.keys()];

        const groups = productGroups.map(group => {
            const productIDs = group.split(',')
            const products = productIDs.map(productID => {
                return this.productMap[productID]
            }).filter(p => p)
            return {products, stores: []}
        })
        this.groups = groups

        /* 
            LEFT OFF HERE
            - when opening map with store list, basically for every single product,
            need to get the store quantity specific for that product
            - need to pass in custom quantity somehow to map
        */
    }
    @observable groups = [];

    render() {
        return (
            <div>
                {this.groups.map((g, i) => {
                    return (
                        <div key={i.toString()}>
                            Stores that contain
                            {g.products.map(p => p.name)}
                        </div>
                    )
                })}
			</div>
        )
    }
}

export interface Props {
    selected: Product[]
}
