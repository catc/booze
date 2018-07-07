// import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { Link } from 'react-router-dom'

/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class SearchResults extends Component<Props, {}> {
	constructor(props: Props){
		super(props)
	}

	/*@action.bound
	async yourAction() {
		// ...
	}*/

	render(){
		return (
			<div>
				<ul>
					{this.props.results.map(res => {
						return <li key={res.id}>
							<Link to={`/product/${res.id}`}>
								{res.name}
							</Link>
						</li>
					})}
				</ul>
			</div>
		)
	}
}

SearchResults.propTypes = {
	
}

export interface Props {
	someProp: string;
}
