import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter, match } from 'react-router'
import { History } from 'node_modules/@types/history/index';

// import ProductView from 'routes/detailed/index'
import modal from 'components/common/modal/index';
import ProductView from 'routes/product/index'
import { X } from 'components/icons/index';

/* 
    TODO
    - create a wrapper that fetches content
    - create a new component that just takes an id and fetches content
        - maybe calls a callback when it's done fetching content and rendering?
    - find a way to pass a custom close function to modal wrapper
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
    center: true,
    // additionalClasses: 'type_rounded',
    // autoShow: true
})
@inject(stores => ({
    modalStore: stores.modalStore,
}))
@observer
class ProductModal extends Component<ProductModal, {}> {
    productid?: number;
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
    
    displayContent = () => {
        console.log('content is done loading, would show now')
        this.props.showContent({
            center: false
        })
    }

    render(){
        const data = this.props.data
        return (
            <div className="product-modal">

                {/* <button className="product-modal__close-btn" onClick={this.props.closeModal}><X/></button> */}

                <ProductView
                    hasLoaded={this.displayContent}
                    productid={this.productid}
                />
			</div>
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
    `ProductModalRoute` is solely responsible for initiating
    the modal containing the product view
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
