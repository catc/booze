import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter, match } from 'react-router'
import { History } from 'node_modules/@types/history/index';

import modal from 'components/common/modal/index';
import ProductView from 'routes/product/content-wrapper/index'

/* 
    How this works:
    - `ProductModalRoute`
        - is the route that is navigated to on clicking a product modal
    - `ProductModal`
        - modal wrapper that passes product id to `ProductView`
        data fetcher, and is responsible for showing modal content
    - `ProductView` responsible for fetching data and rendering content
*/

interface ProductModal {
    configureCloseModal: (config: {
        afterCloseModal?: () => void,
        beforeCloseModal?: () => void
    }) => void;
    data: {id: string}
    history: History;
    closeModal: () => void;
}

@modal({
    // center: true,
    // autoShow: true
    // animation: 'fade-drop-in'
})
@inject(stores => ({
    modalStore: stores.modalStore,
}))
@observer
class ProductModal extends Component<ProductModal, {}> {
    productid: number;
    constructor(props: ProductModal){
        super(props)

        // configure close modal on parent so that
        // when it closes, it also goes back
        props.configureCloseModal({
            afterCloseModal: () => props.history.goBack()
        })

        try {
            this.productid = parseInt(props.data.id, 10);
            if (!this.productid){
                throw new Error('Detailed modal view requires an id');
            }
        } catch (err){
            console.error('Error parsing id', err)
            props.closeModal();
        }
    }
    
    displayContent = (hasError: boolean = false) => {
        const opts = {}
        if (hasError){
            // if error, center modal
            opts.center = true;
            opts.maxWidth = 400
        } else {
            // if no error, align modal to top
            opts.center = false;
            opts.animation = 'fade-drop-in'
            opts.maxWidth = 720
        }

        this.props.showContent(opts)
    }

    render(){
        const data = this.props.data
        return (
            <ProductView
                hasLoadedCb={this.displayContent}
                productid={this.productid}
                isModal={true}
                closeModal={this.props.closeModal}
            />
        )
    }

    static propTypes = {
        data: P.object.isRequired,
        showContent: P.func.isRequired,
        closeModal: P.func.isRequired,
    }
}
const productModalWithRouter = withRouter(ProductModal)





/* 
    `ProductModalRoute` is solely responsible creating a modal
    view with the component that contains the product, see above
*/
export interface ProductModalRouteProps {
    history: History
}

@inject(stores => ({
    modalStore: stores.modalStore,
}))
class ProductModalRoute extends Component<ProductModalRouteProps, {}> {
    constructor(props: ProductModalRouteProps) {
        super(props)

        this.props.modalStore.newModal(productModalWithRouter, {
            id: props.match.params.id
        });
    }

    render(){
        return null
    }
}

ProductModalRoute.wrappedComponent.propTypes = {
    modalStore: P.shape({
        newModal: P.func.isRequired
    }).isRequired
}

export default withRouter(ProductModalRoute)
