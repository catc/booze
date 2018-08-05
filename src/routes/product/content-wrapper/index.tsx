import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { getProduct, Product } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'
import { X } from 'components/icons/index'
import ProductContent from './content/index'
import MapWrapper from './map-wrapper/index'
import RecentlyViewed from './recently-viewed/index'
import ErrorMsg from 'components/common/error/index'
/* 
    responsible for accepting product id and
    rendering either error view or product view
*/

@inject(stores => ({
    recent: stores.recentlyViewed,
}))
@observer
export default class ProductView extends Component<Props, {}> {
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

            // add to 'recently viewed' history
            this.props.recent.add({
                id: result.id,
                name: result.name,
                image_thumb_url: result.image_thumb_url,
                price_in_cents: result.price_in_cents,
                package: result.package,
            })
        } catch (err) {
            console.error('Error fetching product', err)
            this.doneLoading(true)
        }
    }

    doneLoading(hasError: boolean = false){
        this.loading = false;
        this.error = hasError;

        // this only applies to modal
        // once content is loaded, show the content
        if (this.props.hasLoadedCb){
            this.props.hasLoadedCb(hasError)
        }
    }

    render() {
        const typeClass = this.props.isModal ? 'type_modal' : 'type_full';

        if (this.loading){
            return (
                <div className={`container product-wrapper__loading ${typeClass}`}>
                    <Spinner />
                </div>
            )
        }

        if (this.error){
            return (
                <ErrorMsg
                    className={`product-wrapper__error ${typeClass}`}
                >There was an error loading this product</ErrorMsg>
            )
        }

        return (
            <div className={`container product-wrapper ${typeClass}`}>
                {/* close button if modal */}
                {this.props.isModal ?
                    <button className="product-wrapper__close-modal" onClick={this.props.closeModal}><X/></button>
                    :
                    null
                }

                {/* content + map */}
                <ProductContent product={this.product}/>
                <MapWrapper product={this.product}/>
                <RecentlyViewed isModal={this.props.isModal}/>
			</div>
        )
    }
}

ProductView.propTypes = {

}

export interface Props {
    productid: number;
    isModal: boolean;
    hasLoadedCb: (hasError?: boolean) => void;
    closeModal?: () => void
}