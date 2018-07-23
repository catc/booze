import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { match } from 'node_modules/@types/react-router/index';

import ProductView from 'routes/product/index'

/* @observer
export default class FullPageProduct extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return <ProductView productid={this.props.match.params.id}/>
    }
} */

function FullPageProduct({ match }: Props) {
    return <ProductView productid={match.params.id} />
}

export default observer(FullPageProduct)

FullPageProduct.propTypes = {

}

export interface Props {
    match: match;
}

