import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { Wishlist } from 'store/wishlist'
import Item from './items/item'

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

    @computed get saved(){
        const saved = []
        this.props.wishlist.saved.forEach(product => saved.push(product))
        return saved
    }

    // remove index used by child to calculate transition delay
    @observable removeIndex: number | null = null;
    remove = (product) => {
        this.removeIndex = this.saved.indexOf(product)
        this.props.wishlist.toggle(product)
    }

    render() {
        const { wishlist } = this.props
        return (
            <div className="wishlist container">
                <h1 className={this.isEmpty ? 'state_empty' : ''}>Wishlist</h1>

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
                            />
                        ))}
                    </ul>
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