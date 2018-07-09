import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import mapCache from 'store/map'
import { getStoreInventories, Store } from 'api/lcbo'

@observer
export default class ProductAvailability extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetchData()
    }
    
    /* componentDidMount(){
        return mapCache.initMap(this.mapEl) // for testing
    } */
    
    @action async fetchData(){
        // get stores that contain product
        const stores: Store[] = await getStoreInventories(this.props.productID)

        // start up map
        this.initMap(stores)
    }

    map?: google.maps.Map;
    mapEl?: HTMLElement;
    async initMap(stores: Store[]) {
        this.map = await mapCache.initMap(this.mapEl)

        // TODO - improve this by only displaying markers within map viewport
        stores.map(store => {
            const coords = {
                lat: store.latitude,
                lng: store.longitude
            };

            const marker = new google.maps.Marker({
                position: coords,
                map: this.map,
                clickable: true,
                title: 'View store',
                // animation: google.maps.Animation.DROP
            })
            
            marker.addListener('click', () => {
                this.selectStore(store)
            })
        })
    }

    @observable selectedStore = {};
    @action selectStore(store: Store){
        this.selectedStore = store;
    }

    render() {
        return (
            <div>

                {/* map */}
                <div
					ref={el => this.mapEl = el}
					id="map"
					style={{
						width: 700,
						height: 700,
						border: '1px solid #ddd'
					}}
				>Loading...</div>

                <div>
                    {this.selectedStore ?
                        this.selectedStore.name
                        :
                        'Select a store'
                    }
                </div>
			</div>
        )
    }
}

ProductAvailability.propTypes = {

}

export interface Props {
    someProp: string;
}
