import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { getProduct, Product } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'
import { wait } from 'utils/async'
import { Alertoctagon } from 'components/icons/index'

/* 
    responsible for accepting product id and
    rendering either error view or product view
*/

@observer
export default class ProductData extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetchData();
    }

    @observable loading = true;
    @observable error: boolean = false;
    @observable product: Product | undefined;

    @action async fetchData() {
        const id = this.props.productid

        // return this.doneLoading(true) // FOR TESTING ONLY
        try {
            // get product
            const { result } = await getProduct(id)
            this.product = result;
            this.doneLoading()
        } catch (err) {
            console.error('Error fetching product', err)
            this.doneLoading(true)
        }
    }

    doneLoading(hasError: boolean = false){
        this.loading = false;
        this.error = hasError;
        if (this.props.hasLoadedCb){
            this.props.hasLoadedCb(hasError)
        }
    }

    /* 
        TODO - LEFT OFF HERE
        - clean up classes for regular vs modal
            - for loading, error and regular
        - create component for rendering content
    */

    render() {
        if (this.loading){
            return (
                <div className="container product-wrapper__common product-wrapper__loading">
                    <Spinner />
                </div>
            )
        }

        if (this.error){
            return (
                <div className="container product-wrapper__common product-wrapper__error">
                    <div className="product-wrapper__error-icon">
                        <Alertoctagon/>
                    </div>
                    <span>There was an error loading this product</span>
                </div>
            )
        }

        return (
            <div className={`product-wrapper container ${this.props.isModal ? 'type_modal' : ''}`}>
                content = {this.product.name}
			</div>
        )
    }
}

ProductData.propTypes = {

}

export interface Props {
    productid: number;
    isModal: boolean;
    hasLoadedCb: (hasError?: boolean) => void
}