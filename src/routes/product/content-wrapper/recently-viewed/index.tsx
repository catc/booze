import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'

import { getNonProductQS, PRODUCT_QUERY_KEY } from 'utils/query-string';

// TODO - change to stateless?

@inject(stores => ({
    recent: stores.recentlyViewed,
}))
@observer
export default class RecentlyViewed extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.products = props.recent.products.slice(1)
    }

    @computed get qs(){
        return getNonProductQS(location.search)
    }

    render() {
        if (!this.products.length){
            return null;
        }
        return (
            <div className="recently-viewed">
                <h2>Recently viewed</h2>
                <ul className="recently-viewed__list">
                    {this.products.map(p => {
                        return (
                            <li
                                key={p.id}
                                className="recently-viewed__product"
                            >
                                <Link to={{
                                    // pathname: `/p/${p.id}`,
                                    // state: { modal: true }
                                    search: `${this.qs}&${PRODUCT_QUERY_KEY}=${p.id}`
                                }}>
                                    <img src={p.image_thumb_url} alt=""/>
                                    <span>{p.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
			</div>
        )
    }
}

RecentlyViewed.propTypes = {

}

export interface Props {
    // someProp: string;
}
