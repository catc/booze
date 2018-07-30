import './style.scss';
import React, { Component, ReactEventHandler, SyntheticEvent, ButtonHTMLAttributes } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Product } from 'api/lcbo'
import Image from 'components/common/image/index'
import { price } from 'utils/format'
import { Gift, Search } from 'components/icons/index'
import { getNonProductQS, PRODUCT_QUERY_KEY } from 'utils/query-string';


interface ResultProps {
	result: Product;
	toggleWishlistItem: (id: number) => {}
}

@observer
class Result extends Component<ResultProps, {}> {
	wishlist = (e: SyntheticEvent<HTMLElement>) => {
		e.preventDefault();
		this.props.toggleWishlistItem(this.props.result.id);
	}

	@computed get qs() {
		return getNonProductQS(location.search)
	}

	render(){
		const { result } = this.props
		return (
			<li className="result">
				<Link to={{
					search: `${this.qs}&${PRODUCT_QUERY_KEY}=${result.id}`
				}}>
					<div className="result__img">
						<Image src={result.image_thumb_url} />
					</div>
					<div className="result__content">
						<span className="result__name">{result.name}</span>
						<span className="result__origin">
							{result.origin}
							{result.producer_name ?
								<strong>, {result.producer_name}</strong>
								:
								null
							}
						</span>
						<div className="result__price-wrapper">
							<span className="result__price price">{price(result.price_in_cents)}</span>
							<span className="result__package">{result.package}</span>
							<button
								className="result__wishlist"
								onClick={this.wishlist}
							><Gift /></button>
						</div>
					</div>
				</Link>
			</li>
		)	
	}
}

// TODO - convert to stateless
@inject(stores => ({
	wishlist: stores.wishlist,
}))
@observer
class SearchResults extends Component<Props, {}> {
	render() {
		return (
			<ul className="results">
				{this.props.results.map(res =>
					<Result
						key={res.id}
						result={res}
						toggleWishlistItem={this.props.wishlist.toggleItem}
					/>
				)}
			</ul>
		)
	}
}

export default withRouter(SearchResults)

SearchResults.propTypes = {
	// TODO
}
