import './style.scss';
import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'

import { search, randomProducts } from 'api/lcbo'
// import SearchResults from './results';
import ShuffleResults from './shuffle/index';
// import { Shuffle } from '../../components/icons/index';

import Spinner from 'components/common/spinner/index'
import SearchBar from './search-bar/index'
import SearchResults from './search-results'
import { getQuery } from 'utils/query-string';

/* const QUERY_KEY = 'q'

function getQuery(qs: string){
	const params = new URLSearchParams(qs)
	if (params.has(QUERY_KEY)){
		return params.get(QUERY_KEY).trim()
	}
	return null;
} */

@observer
class Home extends Component<Props, {}> {
	@observable resultsType = '';
	@observable searchTerm = '';

	constructor(props){
		super(props)

		// TODO - if has query, do search immediately
		this.setContentType(getQuery())
	}

	@action setContentType = (searchTerm: string|null) => {
		if (searchTerm){
			this.resultsType = 'search'
			this.searchTerm = searchTerm
		} else {
			this.resultsType = 'shuffle'
		}
	}

	render(){
		return (
			<div className="container home">
				{/* search bar */}
				<SearchBar />

				{/* content */}
				{this.resultsType === 'shuffle' ?
					<ShuffleResults />
					:
					<SearchResults
						term={this.searchTerm}
					/>
				}
			</div>
		)
	}
}

export default withRouter(Home)

Home.propTypes = {
	
}

export interface Props {
	history: History;
	location: Location
}