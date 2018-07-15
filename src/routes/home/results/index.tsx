import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'

import { Product } from 'api/lcbo'
import Image from 'components/common/image/index'
import { price } from 'utils/format'

interface Props {
	result: Product;
}

const Result = observer(({ result }: Props) => (
	<li className="result">
		<Link to={`/p/${result.id}`}>
			<div className="result__img">
				<Image src={result.image_thumb_url} />
			</div>
			<div className="result__content">
				<span className="result__name">{result.name}</span>
				<span className="result__origin">{result.origin}, <strong>{result.producer_name}</strong></span>
				<span className="result__price">{price(result.price_in_cents)}</span>
				<span className="result__package">{result.package}</span>
			</div>
		</Link>
	</li>
))

const SearchResults = observer(({ results }) => (
	<ul className="results">
		{results.map(res =>
			<Result key={res.id} result={res} />
		)}
	</ul>
))

export default SearchResults
