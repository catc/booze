import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'

import HomeRoute from 'routes/home/index'
import NotFound from 'routes/four-oh-four/index'
import ProductModal from 'routes/product/product-modal/index'
import ProductFullPage from 'routes/product/full-page/index'
import WishlistPage from 'routes/wishlist/index'
import { Location, History } from 'node_modules/@types/history/index';
import { getQueryParam, getNonProductQS, PRODUCT_QUERY_KEY } from 'utils/query-string';
import { wait } from 'utils/async'

@observer
export default class Routes extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
        
        this._redirectIfProduct()
    }
    
    initialLoad = true;
    async _redirectIfProduct(){
        // it there a product query param, redirect to product page
        if (this.productQS){
            this.props.history.replace({
                pathname: `/p/${this.productQS}`
            })
        }

        await wait(0)
        // allow for product modals now
        this.initialLoad = false;
    }


    @computed get productQS(): string | null {
        this.props.location.search
        return getQueryParam(PRODUCT_QUERY_KEY);
    }

    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path="/" exact component={HomeRoute} />
                    <Route path="/p/:id" component={ProductFullPage} />
                    <Route path="/wishlist" component={WishlistPage} />
                    <Route component={NotFound} />
                </Switch>

                {/* product modal view */}
                {!this.initialLoad && this.productQS ?
                    <ProductModal productid={this.productQS}/>
                    :
                    null
                }
            </Fragment>
        )
    }
}

Routes.propTypes = {

}

export interface Props {
    location: Location;
    history: History
}
