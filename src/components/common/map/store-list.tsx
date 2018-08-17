import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import debounce from 'lodash/debounce';

import { Store, Product } from 'api/lcbo'

function StoreItem({ store, selectStore, selectedStoreID, quantityFn }: StoreItemProps) {
    const isSelected = selectedStoreID === store.id
    return (
        <li
            data-id={store.id}
            className={`store ${isSelected ? 'state_active': ''}`}
            onClick={() => selectStore(store.id)}
        >
            <span className="store__name">{store.name}</span>
            <span className="store__city">{store.city}</span>
            {quantityFn ?
                quantityFn(store)
                :
                <span className="store__quantity">{store.quantity} in stock</span>
            }

            {isSelected ?
                <div className="store__additional">
                    <span className="store__address">{store.address_line_1}</span>
                    {store.address_line_2 ?
                        <span className="store__address">{store.address_line_2}</span>
                        :
                        null
                    }
                    <span className="store__telephone">{store.telephone}</span>
                </div>
                :
                null    
            }
		</li>
    )
}
interface StoreItemProps {
    store: Store;
    selectStore: (id: number) => void;
    selectedStoreID: null | number;
    quantityFn: (item: Store) => any;
}


@observer
export default class StoreList extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.setFilterRegex = debounce((regex: null | RegExp) => {
            this.filterRegex = regex;
        }, 500);
    }

    @observable filterRegex: null | RegExp = null;
    @observable filterString = '';
    @computed get filteredStores(){
        const reg = this.filterRegex
        if (!reg){
            return this.props.stores;
        }
        return this.props.stores.filter(s => {
            return reg.test(`${s.city} ${s.name}`)
        })
    }
    @action setFilter = e => {
        // update input
        const term = e.target.value;
        this.filterString = term;

        // update regex
        const trimmed = term.trim();
        if (trimmed) {
            this.setFilterRegex(new RegExp(term, 'i'))
        } else {
            this.setFilterRegex(null)
        }
    }

    render() {
        return (
            <div className="stores">
                <div className="stores__search-wrapper">
                    <input
                        type="text"
                        className="stores__search"
                        placeholder="Search stores"
                        value={this.filterString}
                        onChange={this.setFilter}
                    />
                </div>
                <ul className="stores__list">
                    {this.filteredStores.map(s => (
                        <StoreItem
                            key={s.id}
                            store={s}
                            selectStore={this.props.selectStore}
                            selectedStoreID={this.props.selectedStoreID}
                            quantityFn={this.props.quantityFn}
                        />
                    ))}
                </ul>
			</div>
        )
    }
}

StoreList.propTypes = {

}

export interface Props {
    stores: Store[];
    selectStore: (id: number) => void;
    selectedStoreID: null | number;
    quantityFn: (item: Store) => any;
}
