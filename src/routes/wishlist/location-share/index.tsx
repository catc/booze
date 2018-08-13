import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import intersection from 'lodash/intersection'

import { getStoreInventories, Store, Product } from 'api/lcbo'
import modal from 'components/common/modal';

// TODO - write tests for the grouping logic

@modal({
    center: false,
    autoShow: true
})
@observer
export default class LocationCheck extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetch()
    }

    @observable status = 'searching';
    @observable groupList = [];

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

    @computed get productMap(): { [productID: string]: Product } {
        return this.props.selected.reduce((obj, product: Product) => {
            obj[product.id] = product
            return obj
        }, {})
    }

    analyse(productToStore: { [productID: number]: Store[] }){
        const groups = this.generateGroups(productToStore)
        console.log('groups are', groups)

        const containsAllProducts = this.containsAllProducts(groups, this.props.selected.length)
        if (containsAllProducts){
            this.status = 'all'
            console.log('contains all groups')
            // TODO
        } else {
            console.log('doesnt contain all groups')
            const groupsList = this.listGroups(groups, this.productMap)

            if (!groupsList.length){
                this.status = 'empty'
                return
            }

            console.log('group strings are:', groupsList)
            this.groupList = groupsList
            this.status = 'list'
        }
    }

    containsAllProducts(groups: { [productIDs: string]: string[] }, totalProducts: number): boolean {
        for (let groupStr in groups) {
            if (groupStr.split(',').length === totalProducts) {
                return true;
            }
        }
        return false
    }
    
    // formats groups names
    listGroups(groups: { [productIDs: string]: string[] }, productsMap: { [productID: number]: Product }): string[][] {
        const g = [];
        for (let groupStr in groups) {
            const products = groupStr.split(',').map((productID: string) => {
                return productsMap[productID].name
            })
            g.push(products)
        }
        return g;
    }

    // check which stores have at least 2+ of the products selected
    generateGroups(hash: { [productID: number]: Store[] }): { [productIDs: string]: string[] }{
        const storesMap: { [storeID: number]: string[] } = {}

        // get stores mapped to array of products
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
        const groups: { [productIDs: string]: string[] } = {}
        for (let storeID in storesMap) {
            if (storesMap[storeID].length < 2) {
                // only products that share at least 1 store
                continue
            }
            const composite = storesMap[storeID].sort().join(',')
            if (groups[composite]) {
                groups[composite].push(storeID)
            } else {
                groups[composite] = [storeID]
            }
        }

        return groups;
    }
    
    // TODO - incorporate this and test that it works correctly
    mapStoresToProducts(groups: { [productIDs: string]: string[] },
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

        /* {
            productID: {
                storeID: { store }
            }
        } */

        // loop through each store, added store data and product quantities
        return group.map(storeID => {
            let data: StoreData = { quantities: [] }

            /* 
                TODO - change the loop, otherwise need to loop through
                each store from each product
            */
            for (let productID of products) {
                // add quantities per product per store
                // const store = productsToStore[productID].find(s => s.id = storeID)
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

    // TODO - make components for each stte
    // TODO - add 'x' to close component
    content(){
        if (this.status === 'searching'){
            return <div>searching...</div>
        }
        if (this.status === 'all'){
            return <div>all products found! here is map...</div>
        }
    }

    render() {
        // TODO - render group lists, allow for selection
        // TODO - display map
        // TODO - style empty ('no common stores found for all selected products')
        return (
            <div className="wishlist-location">
                {this.content()}
			</div>
        )
    }
}

export interface Props {
    selected: Product[]
}
