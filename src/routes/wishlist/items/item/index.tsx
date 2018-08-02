import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { TruncatedProduct } from 'store/lcbo'
import productModal from '../../../product/product-modal/index';
import { wait } from 'utils/async'

function transform(x: number, y: number){
    return `translate(${x}px, ${y}px)`
}
function transition(delay = 0){
    return `transform 0.3s ${delay}ms ease`
}

@observer
export default class WishlistItem extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    @action remove = () => {
        this.props.remove(this.props.product)
    }

    getSnapshotBeforeUpdate(prevProps){
        if (prevProps.index !== this.props.index){
            const position = [this.el.offsetLeft, this.el.offsetTop]
            return { oldPosition: position }
        }
        return null
    }

    @observable transform = ''
    @observable transition = ''
    componentDidUpdate(pp, ps, snapshot){
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

        const delay = Math.min(Math.pow(this.props.index - this.props.removeIndex, 1.5), 7.5)
        this.transition = transition(delay * 50)
        this.transform = transform(0, 0)
    }

    render() {
        const {product} = this.props
        return (
            <li
                className="wishlist-item"
                ref={el => this.el = el}
                style={{
                    transform: this.transform,
                    transition: this.transition
                }}
                // onClick={this.remove}
            >
                {product.name}
             
                <button onClick={this.remove}>Remove</button>
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
}