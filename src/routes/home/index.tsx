import './style.scss';
import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'

import ShuffleResults from './shuffle/index';
import SearchBar from './search-bar/index'
import SearchResults from './search-results'

@observer
export default class Home extends Component<Props, {}> {
	@observable searchTerm: string|null = null;

	@action setSearchTerm = (searchTerm: string|null) => {
		this.searchTerm = searchTerm
	}

	render(){
		return (
			<div className="container home">
				{/* search bar */}
				<SearchBar
					setSearchTerm={this.setSearchTerm}
				/>

				{/* content */}
				{this.searchTerm ?
					<SearchResults
						term={this.searchTerm}
					/>
					:
					<ShuffleResults />
				}
			</div>
		)
	}
}

// export default withRouter(Home)

Home.propTypes = {
	
}

export interface Props {
	history: History;
	location: Location
}