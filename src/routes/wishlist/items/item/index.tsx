import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { TruncatedProduct } from 'store/lcbo'
import { wait } from 'utils/async'
import { Circle, Checkcircle } from 'components/icons/index'
import Image from 'components/common/image/index'
import ProductLink from 'components/common/product-link/index'
import { price } from 'utils/format'

function transform(x: number, y: number){
    return `translate(${x}px, ${y}px)`
}
function transition(delay = 0){
    return `transform 0.3s ${delay}ms ease, border-color 0.2s ease-out`
}

@observer
export default class WishlistItem extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    @action remove = () => {
        this.props.remove(this.props.product)
    }

    getSnapshotBeforeUpdate(prevProps: Props){
        if (prevProps.index !== this.props.index){
            const position = [this.el.offsetLeft, this.el.offsetTop]
            return { oldPosition: position }
        }
        return null
    }

    @observable transform = ''
    @observable transition = ''
    componentDidUpdate(pp, ps, snapshot: null | {position: [number, number]}){
        if (snapshot && snapshot.oldPosition){
            const p = snapshot.oldPosition
            const x = p[0] - this.el.offsetLeft
            const y = p[1] - this.el.offsetTop
            this.updatePosition(x, y)
        }
    }
    
    async updatePosition(oldX: number, oldY: number){
        // use that FLIP goodness
        this.transform = transform(oldX, oldY)
        this.transition = ''

        await wait(0)

        const delay = Math.min(Math.pow(this.props.index - this.props.removeIndex, 1.4), 7.5)
        this.transition = transition(delay * 50)
        this.transform = transform(0, 0)
    }

    select = (e) => {
        e.preventDefault()
        this.props.select(this.props.product);
    }

    render() {
        const {product} = this.props
        return (
            <li
                data-id={product.id}
                className={`wishlist-item ${product.selected ? 'state_active' : ''}`}
                ref={el => this.el = el}
                style={{
                    transform: this.transform,
                    transition: this.transition
                }}
            >
                <ProductLink productID={product.id}>
                    <Image
                        className="wishlist-item__image"
                        src={product.image_thumb_url}
                    />

                    <button
                        onClick={this.select}
                        className={`wishlist-item__select ${product.selected ? 'state_active' : ''}`}
                    >
                        {product.selected ?
                            <Checkcircle/>
                            :
                            <Circle/>
                        }
                    </button>

                    <div className="wishlist-item__content">
                        <span className="wishlist-item__name overflow-ellipsis">{product.name}</span>
                        <span className="wishlist-item__price price type_small">{price(product.price_in_cents)}</span>
                        <span className="wishlist-item__package">{product.package}</span>
                    </div>
                </ProductLink>
			</li>
        )
    }
}

WishlistItem.propTypes = {

}

export interface Props {
    product: TruncatedProduct;
    index: number;
    removeIndex: number;
    remove: (id: number) => void
    select: (id: number) => void
}