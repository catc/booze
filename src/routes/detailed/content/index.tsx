// import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { Product } from 'api/lcbo'
import Image from 'components/common/image'
/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class ProductContent extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

	/*@action.bound
	async yourAction() {
		// ...
	}*/

    render() {
        const product = this.props.product
        return (
            <div>
                <div>
                    <h1>{product.name}</h1>
                    <div className="product__thumb">
                        <img src={product.image_url} />
                    </div>
                    <div className="product__thumb">
                        <Image src={product.image_url} />
                    </div>
                </div>
			</div>
        )
    }
}

ProductContent.propTypes = {

}

export interface Props {
    product: Product;
}
