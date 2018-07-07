import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'

import { getProduct, getStoreInventories } from 'api/lcbo'

@observer
class ProductView extends Component<Props, {}> {
	id: string;
	constructor(props: Props){
		super(props)

		this.id = props.match.params.id
		this.fetchData();
	}

	@observable result = {};
	@action async fetchData(){
		try {
			const { result } = await getProduct(this.id)
			this.result = result;
			console.log(result);

			const resp = await getStoreInventories(this.id)
			console.log('resp is', resp);
		} catch (err){
			console.error('Error fetching product', err)
		}
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
			</div>
		)
	}
}

export default withRouter(ProductView)

ProductView.propTypes = {
	
}

export interface Props {
	// match: 
}

