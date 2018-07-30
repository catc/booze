import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import { Product } from 'api/lcbo'
import Image from 'components/common/image'
import { price, alcohol, lcboLink } from 'utils/format'
import { Gift } from 'components/icons/index'

@observer
export default class ProductContent extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    header(mobile: boolean){
        const type = mobile ? 'type_mobile': 'type_desktop';
        const product = this.props.product;
        return (
            <>
                <h1 className={`product__name ${type}`}>{product.name}</h1>
                <div className={`product__origin ${type}`}>
                    {product.origin}
                    {product.producer_name ?
                        <strong>, {product.producer_name}</strong>
                        :
                        null
                    }
                </div>
            </>
        )
    }

    render() {
        const product = this.props.product
        return (
            <div className="product">
                {this.header(true)}
                <Image
                    src={product.image_url}
                    className="product__image"
                />
                <div className="product__content">
                    {this.header(false)}

                    {product.tasting_note ?
                        <p className="product__description">{product.tasting_note}</p>
                        :
                        null
                    }

                    {/* details */}
                    <div className="product__details">
                        <div className="product__field">
                            <label>Alcohol</label>
                            <span className="type_percent">{alcohol(product.alcohol_content)}</span>
                        </div>
                        {product.style ?
                            <div className="product__field">
                                <label>Style</label>
                                <span className="">{product.style}</span>
                            </div>
                            :
                            null
                        }
                        {product.varietal ?
                            <div className="product__field">
                                <label>Varietal</label>
                                <span className="">{product.varietal}</span>
                            </div>
                            :
                            null
                        }
                        {product.serving_suggestion ?
                            <div className="product__field">
                                <label>Serving</label>
                                <span className="">{product.serving_suggestion}</span>
                            </div>
                            :
                            null
                        }
                        <a
                            href={lcboLink(product.id)}
                            className="product__link"
                            target="_blank"
                        >Link to LCBO</a>
                    </div>

                    {/* price */}
                    <div className="product__price-wrapper">
                        {product.price_in_cents ?
                            <span className="product__price price">{price(product.price_in_cents)}</span>
                            :
                            null
                        }
                        <span className="product__package">{product.package}</span>

                        <button
                            className="product__wishlist"
                            onClick={this.wishlist}
                        ><Gift /></button>
                    </div>
                </div>
            </div>
        )
    }
}

ProductContent.propTypes = {

}

export interface Props {
    product: Product;
}
