import './style.scss';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'

import { getNonProductQS, PRODUCT_QUERY_KEY } from 'utils/query-string';
import Image from 'components/common/image/index'
import { TruncatedProduct } from 'api/lcbo'
import { price } from 'utils/format'
import { Clock } from 'components/icons/index'

function recentlyViewed({recent}){
    const products: TruncatedProduct[] = recent.products.slice(1)

    if (!products.length) {
        return null;
    }

    const qs = getNonProductQS(location.search)

    return (
        <div className="recently-viewed">
            <div className="recently-viewed__header">
                <h2 className="recently-viewed__title"><Clock /> Recently viewed</h2>
                <button
                    onClick={recent.clear}
                    className="recently-viewed__clear"
                >Clear History</button>
            </div>
            <ul className="recently-viewed__list">
                {products.map(p => {
                    return (
                        <li
                            key={p.id}
                            className="recently-viewed__product"
                        >
                            <Link to={{
                                search: `${qs}&${PRODUCT_QUERY_KEY}=${p.id}`
                            }}>
                                <Image
                                    src={p.image_thumb_url}
                                    className="recently-viewed__image"
                                />

                                <div className="recently-viewed__content">
                                    <span className="recently-viewed__name overflow-ellipsis">{p.name}</span>
                                    <span className="recently-viewed__price price type_small">{price(p.price_in_cents)}</span>
                                    <span className="recently-viewed__package">{p.package}</span>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default inject(stores => ({
    recent: stores.recentlyViewed
}))(observer(recentlyViewed))
