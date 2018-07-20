import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter, match } from 'react-router'

import { getProduct, Product } from 'api/lcbo'
import AvailabilityMap from './map'
import Content from './content'

import get from 'lodash/get'
import ProductModal from 'routes/detailed-modal/index'

@inject(stores => ({
	modalStore: stores.modalStore,
}))
@observer
class ProductView extends Component<Props, {}> {
	id: string;
	constructor(props: Props){
		super(props)

		// console.log('props are', props)

		const isModal = get(props, 'data.isModal')
		if (!isModal){
			this._testing = true;
		}
		return;
		this.id = props.match.params.id
		this.fetchData();
	}

	@observable displayMap = false;
	@observable product: Product|{} = {};

	@action async fetchData(){
		try {
			// get product
			const { result } = await getProduct(this.id)
			this.product = result;

			// this.displayAvailability() // FOR TESTING
		} catch (err){
			console.error('Error fetching product', err)
		}
	}
	
	@action displayAvailability = () => {
		this.displayMap = true;
	}
	

	render(){
		if (this._testing){
			return <ProductModal/>
		}

		if (!this.product.name){
			return 'Loading...'
		}

		return (
			<div>
				{/* main content */}
				<Content
					product={this.product}
				/>

				{/* availability map */}
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

