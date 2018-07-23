import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { match } from 'node_modules/@types/react-router/index';

import ProductView from 'routes/product/content-wrapper/index'

/* 
    responsible for getting route product id param and passing
    to `ProductView` component which actually fetches content
*/

function FullPageProduct({ match }: Props) {
    return <ProductView productid={match.params.id} />
}

export default observer(FullPageProduct)

// FullPageProduct.propTypes = {
// // ...
// }

export interface Props {
    match: match;
}
