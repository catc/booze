import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import 'gsap/ScrollToPlugin'
import { TweenLite } from 'gsap';
import { Expo } from 'gsap/EasePack';

import mapCache from 'store/map'
import { Store, Product } from 'api/lcbo'
import { Map, Shoppingcart } from 'components/icons/index'
import { wait } from 'utils/async'
import StoreList from './store-list';
import { RED_MARKER, BLUE_MARKER } from 'store/map-const'

@observer
export default class ProductAvailability extends Component<Props, {}> {
    componentDidMount(){
        this.initMap()
    }

    map?: google.maps.Map;
    mapEl?: HTMLElement;
    markers: google.maps.Marker[] = []
    @observable mapLoaded = false;
    async initMap() {
        await wait(300) // for animation to finish
        this.map = await mapCache.initMap(this.mapEl)

        // TODO - improve this by only displaying markers within map viewport
        this.markers = this.props.stores.map(store => {
            const coords = {
                lat: store.latitude,
                lng: store.longitude
            };

            const marker = new google.maps.Marker({
                position: coords,
                map: this.map,
                clickable: true,
                title: 'View store',
                icon: RED_MARKER
                // animation: google.maps.Animation.DROP
            })
            marker.storeID = store.id
            
            marker.addListener('click', () => {
                this.selectStore(store.id)
            })

            return marker;
        })

        this.mapLoaded = true
    }

    @observable displayStoreSection = false;
    // @observable displayStoreSection = true; // FOR TESTING
    @action toggleStoreSection = (val?: boolean) => {
        if (typeof val === 'boolean'){
            this.displayStoreSection = val
        } else {
            this.displayStoreSection = !this.displayStoreSection
        }
    }

    componentWillUnmount(){
        const map = this.map;
        // remove markers from map
        this.markers.forEach(m => {
            m.setMap(null);
        })
        this.markers = []
    }

    @observable selectedStoreID: null | number = null;
    @action selectStore = async (id: number) => {
        const store = this.props.stores.find(s => s.id === id);
        if (!store){
            return;
        }
        this.selectedStoreID = id;

        this.map.setCenter({
            lat: store.latitude,
            lng: store.longitude
        })

        this.markers.forEach(m => {
            const src = m.storeID === id ? BLUE_MARKER : RED_MARKER
            m.setIcon(src)
        })

        if (!this.displayStoreSection){
            // open store panel and wait for it to render before
            // scrolling down to store
            this.toggleStoreSection(true)
        }
        // wait for render to update selected store additional info
        // before scrolling down
        await wait(0)
        
        const allStores = document.querySelectorAll('.store');
        const sid = id.toString()
        const selectedStore = [].find.call(allStores, s => {
            return s.dataset.id === sid
        })
        if (selectedStore){
            const storesEl = document.querySelector('.stores__list')
            TweenLite.to(storesEl, 0.3, {
                scrollTo: selectedStore.offsetTop - 10,
                ease: Expo.easeOut
            });
        }
    }

    render() {
        return (
            <div className="map-content">
                <div className="map-content__map-wrapper">
                    {/* store button toggle */}
                    {this.mapLoaded ?
                        <button
                            className={`map-content__toggle-store-button ${this.displayStoreSection ? 'state_active' : ''}`}
                            onClick={this.toggleStoreSection}
                        >
                            <Shoppingcart/>
                        </button>
                        :
                        null
                    }

                    {/* map */}
                    <div className="map-content__map"
                        id="map"
                        ref={el => this.mapEl = el}
                    >
                        <div className="map-content__map-icon"><Map/></div>
                    </div>

                    {/* stores */}
                    {this.displayStoreSection ?
                        <StoreList
                            stores={this.props.stores}
                            selectStore={this.selectStore}
                            selectedStoreID={this.selectedStoreID}
                        />
                        :
                        null
                    }
                </div>
			</div>
        )
    }
}

ProductAvailability.propTypes = {

}

export interface Props {
    stores: Store[];
    product: Product
}
