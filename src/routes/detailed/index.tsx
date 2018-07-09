import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter, match } from 'react-router'

import { getProduct } from 'api/lcbo'
import AvailabilityMap from './map'

@observer
class ProductView extends Component<Props, {}> {
	id: string;
	constructor(props: Props){
		super(props)

		this.id = props.match.params.id
		this.fetchData();
	}

	@observable displayMap = false;
	@observable result = {};

	@action async fetchData(){
		try {
			// get product
			const { result } = await getProduct(this.id)
			this.result = result;

			this.displayAvailability() // FOR TESTINY
		} catch (err){
			console.error('Error fetching product', err)
		}
	}
	
	@action displayAvailability = () => {
		this.displayMap = true;
	}
	

	render(){
		return (
			<div>
				{this.id}
				{this.result.name ?
					<div>
						<h1>{this.result.name}</h1>
						<div className="product__thumb">
							<img src={this.result.image_thumb_url}/>
						</div>
					</div>
					:
					null
				}
				<button onClick={this.displayAvailability}>Show availability</button>

				{this.displayMap ?
					<AvailabilityMap
						productID={this.id}
					/>
					:
					null
				}
			</div>
		)
	}
}

export default withRouter(ProductView)

ProductView.propTypes = {
	
}

export interface Props {
	match: match
}

