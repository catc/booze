import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import { getNonProductQS, PRODUCT_QUERY_KEY } from 'utils/query-string';

function ProductLink({ children, productID }: Props) {
    const qs = getNonProductQS(location.search)
    const search = `${qs}&${PRODUCT_QUERY_KEY}=${productID}`
    return (
        <Link to={{ search }}>
            {children}
        </Link>
    )
}

interface Props {
    children: any;
    productID: number;
}

export default ProductLink