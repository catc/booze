import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { Wishlist } from 'store/wishlist'
import Item from './items/item'
import LocationShare from './location-share/index'
import { TruncatedProduct } from 'api/lcbo'
import { wait } from '../../utils/async';

const FADE_DURATION = 300

@inject(stores => ({
    wishlist: stores.wishlist,
}))
@observer
export default class WishlistRoute extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    @computed get isEmpty(): boolean {
        return !this.props.wishlist.saved.size
    }

    @computed get saved(): TruncatedProduct[] {
        /* 
            for some reason, the following doesn't work even though it should
            return [...this.props.wishlist.saved.toJS()]
            typescript error? or mobx? it works in chrome console
        */
    //    console.log('RECOMPUTING')
        const saved: TruncatedProduct[] = []
        /* 
        this.props.wishlist.saved.forEach(product => saved.push(
            observable(Object.assign({selected: false}, product)))
        ) */
        let i = 0;
        this.props.wishlist.saved.forEach((product) => {
            const obj = observable(Object.assign({
                selected: [4, 5].includes(i) ? true : false
            }, product))
            saved.push(obj)
            i++
        })
       /*  this.props.wishlist.saved.forEach(product => saved.push(
            product
        )) */
        // window.s = saved
        return saved
    }
    
    @action select = (product) => {
        console.log('product is', product)
        product.selected = !product.selected
    }

    // remove index used by child to calculate transition delay
    @observable removeIndex: number | null = null;

    remove = (product: TruncatedProduct) => { // TODO - remove
        this.removeIndex = this.saved.indexOf(product)
        this.props.wishlist.toggle(product)
    }
    
    @action delete = async () => {
        const ids = this.saved.filter(p => p.selected).map(p => p.id)
        // remove index used by child to calculate transition delay
        this.removeIndex = this.saved.findIndex(p => p.id === ids[0])

        // fade out each element before removing
        ids.map(id => document.querySelector(`.wishlist-item[data-id="${id}"]`))
            .filter(el => el)
            .forEach(el => {
                el.style.transition = `opacity ${FADE_DURATION}ms ease-out`
                el.style.opacity = 0;
            })
        
        await wait(FADE_DURATION)
        this.props.wishlist.remove(ids)
    }

    @computed get selected(){
        return this.saved.filter(s => s.selected)
    }

    // @observable displayLocationCheck = false;
    @observable displayLocationCheck = true;
    @action toggleLocationCheck = () => {
        this.displayLocationCheck = !this.displayLocationCheck;
    }

    render() {
        const { wishlist } = this.props
        return (
            <div className="wishlist container">
                {/* <h1 className={this.isEmpty ? 'state_empty' : ''}>Wishlist</h1> */}

                <button onClick={this.delete}>Delete bulk</button>
                {this.selected.length > 1 ?
                    <button onClick={this.toggleLocationCheck}>Check locations</button>
                    :
                    null
                }

                {this.isEmpty ?
                    <div className="wishlist__empty">You have no items on your wishlist</div>
                    :
                    <ul className="wishlist__list">
                        {this.saved.map((product, i) => (
                            <Item
                            key={product.id.toString()}
                            product={product}
                            removeIndex={this.removeIndex}
                            index={i}
                            remove={this.remove}
                            select={this.select}
                            />
                        ))}
                    </ul>
                }

                {this.displayLocationCheck ?
                    <LocationShare
                        selected={this.selected}
                    />
                    :
                    null
                }
			</div>
        )
    }
}

WishlistRoute.propTypes = {

}

export interface Props {
    wishlist: Wishlist;
}