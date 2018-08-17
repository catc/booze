import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { Wishlist } from 'store/wishlist'
import Item from './items/item'
import LocationShare from './location-share/index'
import { TruncatedProduct, Product } from 'api/lcbo'
import { wait } from '../../utils/async';
import { clearLine } from 'readline';

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
        const saved: TruncatedProduct[] = []
        this.props.wishlist.saved.forEach(product => saved.push(product) )
        return saved
    }
    
    @action select = (product: Product) => {
        product.selected = !product.selected
    }

    // remove index used by child to calculate transition delay
    @observable removeIndex: number | null = null;

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

    @computed get selected(): TruncatedProduct[] {
        return this.saved.filter(s => s.selected)
    }

    @observable displayLocationCheck = false;
    @action toggleLocationCheck = () => {
        this.displayLocationCheck = !this.displayLocationCheck;
    }

    @action confirmClear = () => {
        if (window.confirm('Are you sure you want to clear your wishlist?')){
            this.props.wishlist.clear()
        }
    }

    render() {
        if (this.isEmpty){
            return (
                <div className="wishlist container">
                    <h1>Wishlist</h1>
                    <p className="wishlist__instructions">Add products to your wishlist</p>
                </div>
            )
        }
        const { wishlist } = this.props
        return (
            <div className="wishlist container">
                <h1>Wishlist</h1>
                <p className="wishlist__instructions">Select two or more products to check common location availability</p>

                <div className="wishlist__actions">
                    {this.selected.length ?
                        <button
                            onClick={this.delete}
                            className="wishlist__action type_delete"
                        >Remove item{this.selected.length === 1 ? '' : 's'}</button>
                        :
                        null
                    }
                    {this.selected.length > 1 ?
                        <button
                            onClick={this.toggleLocationCheck}
                            className="wishlist__action type_location"
                        >Check locations</button>
                        :
                        null
                    }
                    <button
                        onClick={this.confirmClear}
                        className="wishlist__action type_clear"
                    >Clear List</button>
                </div>

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
                        close={this.toggleLocationCheck}
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