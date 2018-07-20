// import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { getProduct, Product } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'

@observer
export default class ProductData extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetchData();
    }

    @observable hasSearched = false;
    @observable error: string | null = null;
    @observable product: Product | undefined;

    @action async fetchData() {
        const id = this.props.productid
        try {
            // get product
            const { result } = await getProduct(id)
            this.product = result;

            // TODO - improve
            setTimeout(() => {
                this.props.hasLoaded()
            }, 0);
        } catch (err) {
            console.error('Error fetching product', err)
            this.error = 'Failed to fetch product details'
        }

        this.hasSearched = true;
    }

    render() {
        if (this.error){
            return (
                <div>
                    ERROR: {this.error}
                </div>
            )
        }

        if (!this.hasSearched){
            return (
                <div>
                    <Spinner />
                </div>
            )
        }

        const product = this.product;
        return (
            <div>
                content = {product.name}
			</div>
        )
    }
}

ProductData.propTypes = {

}

export interface Props {
    id: number;
}