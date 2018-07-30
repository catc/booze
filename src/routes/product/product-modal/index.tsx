import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'
import { History } from 'node_modules/@types/history/index';

import ProductView from 'routes/product/content-wrapper/index'
import modal, { OpenModalOptions } from 'components/common/modal/index'
import { getNonProductQS } from 'utils/query-string';

/* 
    wraps product view in a modal
*/

export interface ProductModalRouteProps {
    history: History
    closeModal: () => void;
}

@modal({
    disableRouteChangeClose: true
})
@observer
class ProductModalRoute extends Component<ProductModalRouteProps, {}> {
    @action back = () => {
        
        const qs = getNonProductQS(this.props.location.search)
        this.props.history.push({
            search: qs
        })
    }

    displayContent = (hasError: boolean = false) => {
        const opts: OpenModalOptions = {
            modalDidClose: this.back
        }

        if (hasError) {
            // if error, center modal
            opts.center = true;
            opts.contentWrapperClass = 'product-modal__wrapper type_error'
        } else {
            // if no error, align modal to top
            opts.center = false;
            opts.animation = 'fade-in'
            opts.contentWrapperClass = 'product-modal__wrapper type_loaded'
        }

        this.props.showContent(opts)
    }

    render(){
        return (
            <ProductView
                key={this.props.location.search}
                hasLoadedCb={this.displayContent}
                productid={this.props.productid}
                isModal={true}
                closeModal={this.props.closeModal}
            />
        )
    }
}

export default withRouter(ProductModalRoute)
