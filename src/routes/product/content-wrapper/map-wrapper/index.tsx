import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { CSSTransition } from 'react-transition-group';
import { TweenLite } from 'gsap';
import { Circ } from 'gsap/EasePack';

import { Product } from 'api/lcbo'
import { getStoreInventories, Store } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'
import ErrorMsg from 'components/common/error/index'
import Map from 'components/common/map/index';

const DURATION = 600;
const AnimContainer = observer(({ status, val, children, onEnter}: AnimContainer) => (
    <CSSTransition
        in={status === val}
        timeout={DURATION}
        mountOnEnter
        unmountOnExit
        onEnter={onEnter}
        classNames="map-animation"
    >
        {() => children}
    </CSSTransition>
))
interface AnimContainer {
    status: string;
    val: string;
    children: any;
    onEnter: (el: HTMLElement) => {}
}

/* 
    responsible for fetching store data and displaying
    correct state (searching, error, no results, map view)
*/

@observer
export default class MapWrapper extends Component<Props, {}> {
    w = React.createRef();
    // componentDidMount(){
    //     this.fetchStores() // FOR TESTING
    // }
    
    @observable status = 'initial';
    @observable stores: Store[] = [];
    @action fetchStores = async () => {
        this.status = 'searching'
        try {
            // get stores that contain product
            this.stores = await getStoreInventories(this.props.product.id)
            this.status = this.stores.length ? 'results' : 'empty'
        } catch (err) {
            console.error('Error fetching stores', err)
            this.status = 'error'
        }
    }

    onEnter = (el: HTMLElement) => {
        // get new height
        const w = this.w.current
        const newHeight = el.offsetHeight

        // set current height to container before old element becomes
        // positioned as absolute
        const oldHeight = w.offsetHeight
        w.style.height = oldHeight + 'px'

        // change container update height to new element
        TweenLite.to(w, DURATION / 1000, {
            height: `${newHeight}px`,
            ease: Circ.easeInOut
        });
    }

    render() {
        return (
            <div className="map-wrapper map-animation__wrapper" ref={this.w}>
                <AnimContainer
                    val='initial'
                    status={this.status}
                    onEnter={this.onEnter}
                >
                    <button className="map-wrapper__check-button" onClick={this.fetchStores}>Check Availability</button>
                </AnimContainer>

                <AnimContainer
                    val='error'
                    status={this.status}
                    onEnter={this.onEnter}
                >
                    <ErrorMsg className="map-wrapper__error">There was an error fetching store availability</ErrorMsg>
                </AnimContainer>

                <AnimContainer
                    val='searching'
                    status={this.status}
                    onEnter={this.onEnter}
                >
                    <Spinner className="map-wrapper__searching" />
                </AnimContainer>

                <AnimContainer
                    val='empty'
                    status={this.status}
                    onEnter={this.onEnter}
                >
                    <div className="map-wrapper__empty">There are no stores that have this product in stock</div>
                </AnimContainer>
                
                <AnimContainer
                    val='results'
                    status={this.status}
                    onEnter={this.onEnter}
                >
                    <Map
                        stores={this.stores}
                    />
                </AnimContainer>
			</div>
        )
    }
}


MapWrapper.propTypes = {
    // ...
}

export interface Props {
    product: Product;
}