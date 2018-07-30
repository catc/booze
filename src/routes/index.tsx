import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'

import HomeRoute from 'routes/home/index'
import NotFound from 'routes/four-oh-four/index'
import ProductModal from 'routes/product/product-modal/index'
import ProductFullPage from 'routes/product/full-page/index'
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
            this.props.history.push({
                pathname: `/p/${this.productQS}`
            })
        }

        await wait(0)
        // allow for product modals now
        this.initialLoad = false;
    }

    componentWillUpdate(nextProps: Props) {
        const { location } = this.props;

        // console.log('updated')
        // set previousLocation if props.location is not modal
        /* if (
            nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location;
        } */
        /* if (location.search){
            console.log('locatino.search', location.search)
        } */
        // console.log('gonna update', nextProps)
        /* if (nextPRops){

        } */
    }

    /* @computed get isModal(){
        const { location } = this.props;
        return !!(location.state
            && location.state.modal
            && this.previousLocation !== location
        )
    } */


    @computed get productQS(): string | null {
        return getQueryParam(this.props.location.search, PRODUCT_QUERY_KEY);
    }

    render() {
        const { location } = this.props;

        // console.log(
        //     'is it modal?', this.isModal,
        //     'and also: ', this.isModal ? this.previousLocation : location
        // )
        return (
            <Fragment>
                {/* <Switch location={this.isModal ? this.previousLocation : location}> */}
                <Switch location={location}>
                    <Route path="/" exact component={HomeRoute} />
                    <Route path="/p/:id" component={ProductFullPage} />
                    <Route component={NotFound} />
                </Switch>

                {/* product modal view */}
                {/* {this.isModal ? <Route path="/p/:id" component={ProductModal} /> : null} */}
                {!this.initialLoad && this.productQS ?
                    <ProductModal
                        productid={this.productQS}
                    />
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
