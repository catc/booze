import './style.scss';
import React, { Component, ReactEventHandler, SyntheticEvent, ButtonHTMLAttributes } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'

import { Product } from 'api/lcbo'
import Image from 'components/common/image/index'
import { price } from 'utils/format'
import { Gift } from 'components/icons/index'


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

	render(){
		const { result } = this.props
		return (
			<li className="result">
				<Link to={{
					pathname: `/p/${result.id}`,
					state: {modal: true}
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
							<span className="result__price">{price(result.price_in_cents)}</span>
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

@inject(stores => ({
	wishlist: stores.wishlist,
}))
@observer
export default class SearchResults extends Component<Props, {}> {
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

SearchResults.propTypes = {
	// TODO
}
