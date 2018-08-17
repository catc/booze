import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';

import { getStoreInventories, Store, Product } from 'api/lcbo'
import modal from 'components/common/modal';
import GroupsList from './groups';
import Spinner from 'components/common/spinner/index'
import { X } from 'components/icons/index'
import Map from 'components/common/map/index';
import { containsAllProducts, listGroups, generateGroups, mapStoresToProducts } from './logic'


@modal({
    center: false,
    autoShow: true,
    closeOnEscape: true
})
@observer
export default class LocationCheck extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetch()
    }

    @observable status = 'searching';
    productToStore: {[productID: number]: Store[]} = {};
    groups: { [productIDs: string]: string[] } = {};
    @observable groupList: { [groupStr: string]: string[] } = {};

    // grab stores
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

    // map of product id to product
    @computed get productMap(): { [productID: string]: Product } {
        return this.props.selected.reduce((obj, product: Product) => {
            obj[product.id] = product
            return obj
        }, {})
    }

    // logic handling store data
    analyse(productToStore: { [productID: number]: Store[] }){
        this.productToStore = productToStore
        const groups = generateGroups(productToStore)
        this.groups = groups;

        const containsAllProductsKey = containsAllProducts(groups, this.props.selected.length)
        if (containsAllProductsKey){
            // there are stores that contain ALL selected products
            this.status = 'all'
            this.selectGroup(containsAllProductsKey)
        } else {
            // there aren't any stores that contain ALL selected products, but there
            // might be a subset of stores
            const groupsList = listGroups(groups, this.productMap)
            if (!Object.keys(groupsList).length){
                this.status = 'empty'
                return
            }

            this.groupList = groupsList
            this.status = 'list'
        }
    }

    // selecting a group
    @observable selectedGroupKey: string | null = null;
    @observable selectedStores: Store[] = [];
    @action selectGroup = (groupKey: string) => {
        // set group key
        this.selectedGroupKey = groupKey;

        // map product quantities to store
        this.selectedStores = mapStoresToProducts(this.groups, groupKey, this.productToStore, this.productMap)
    }
  

    render() {
        let content;
        switch (this.status){
            case 'all':
                const len = this.selectedStores.length
                content = <p className="wishlist-location__all">There {len === 1 ? 'was' : 'were'} {len} store{len === 1 ? '' : 's'} found for the products you selected</p>
                break;
            case 'empty':
                content = <p className="wishlist-location__empty">There are no common stores found between the stores you selected</p>
                break;
            case 'list':
                content = <GroupsList
                    list={this.groupList}
                    selectGroup={this.selectGroup}
                    selected={this.selectedGroupKey}
                />
                break;
            default: 
                content = <Spinner className="wishlist-location__spinner"/>
                break;
        }
        
        return (
            <div className="wishlist-location">
                <button className="wishlist-location__close" onClick={this.props.closeModal}><X/></button>
                {content}

                {this.selectedGroupKey ?
                    <Map
                        stores={this.selectedStores}
                        quantityFn={item => (
                            <>
                                {item.quantities.map(q => 
                                    <div
                                        key={q[0]}
                                        className="wishlist-location__quantity"
                                    >
                                        <span className="overflow-ellipsis">{q[0]}</span>
                                        <span>{q[1]} in stock</span>
                                    </div>
                                )}
                            </>
                        )}
                    />
                    :
                    null
                }
			</div>
        )
    }
}

export interface Props {
    selected: Product[]
}
