// import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import Spinner from 'components/common/spinner/index'
import Results from '../results/index'
import { search } from 'api/lcbo'

/* 
    TODO
    - add pagination
    - add bolded titles of search results
    - add 'no results found' state
*/

@observer
export default class SearchResults extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.search()
    }

    @observable isSearching = false;
    @observable results = [];
    
    @action search = async () => {
        const term = this.props.term
        console.log('searching', this.props.term)
        this.isSearching = true
        try {
            const resp = await search(term)
            if (resp.result) {
                this.results = resp.result
            }
        } catch (err) {
            console.error('Error fetching search results', err);
        }
        this.isSearching = false
    }

    componentDidUpdate(prevProps){
        if (prevProps.term !== this.props.term){
            this.search()
        }
    }

    render() {
        if (this.isSearching){
            return <Spinner/>
        }

        return (
            <div>
                search results - {this.props.term}

                <Results results={this.results} />
			</div>
        )
    }
}

SearchResults.propTypes = {

}

export interface Props {
    term: string;
}
