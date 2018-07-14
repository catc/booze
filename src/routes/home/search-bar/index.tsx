import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'

import { search } from 'api/lcbo'
import SearchResults from '../results';
import { Search } from 'components/icons/index';
import { getQuery } from 'utils/query-string';
/* const QUERY_KEY = 'q'

function getQuery(qs: string) {
    const params = new URLSearchParams(qs)
    if (params.has(QUERY_KEY)) {
        return params.get(QUERY_KEY).trim()
    }
    return null;
} */

/* 
    manages query params
*/

@observer
class SearchBar extends Component<Props, {}> {
    @observable term: string = '';
    @action updateTerm = e => this.term = e.target.value
    @action keyDown = e => e.key === 'Enter' ? this.submit() : null

    unlisten: Function;
    constructor(props: Props) {
        super(props)

        // search if query string contains a term
        this.search(props.location.search)

        // listen to changes in query params
        this.unlisten = props.history.listen(location => {
            this.search(location.search)
        })
    };

    componentWillUnmount() {
        this.unlisten()
    }

    @action submit = () => {
        const term = this.term.trim()
        this.props.history.push({
            search: term ? `?${QUERY_KEY}=${term}` : ''
        })
    };

    @observable hasSearched = false;
    @observable isSearching = false;
    @observable results = [];

    @action
    search = async (qs: string) => {
        // check for term
        const term = getQuery(location.search)
        if (!term) {
            this.results = []
            this.hasSearched = false;
            return
        }

        // search
        this.isSearching = true
        try {
            const resp = await search(term)
            if (resp.result) {
                this.results = resp.result
            }
        } catch (err) {
            console.error('Error fetching results', err);
        }
        this.hasSearched = true
        this.isSearching = false
    }

    render() {
        return (
            <div className="search-bar">
                <input
                    className="search-bar__input"
                    placeholder="Search"
                    type="search"
                    value={this.term}
                    onChange={this.updateTerm}
                    onKeyDown={this.keyDown}
                    autoFocus={true}
                />
                <button
                    onClick={this.submit}
                    className="search-bar__button"
                ><Search/></button>

                {this.hasSearched ?
                    this.isSearching ?
                        'searching...'
                        :
                        <SearchResults
                            results={this.results}
                        />
                    :
                    null
                }
            </div>
        )
    }
}

export default withRouter(SearchBar)

SearchBar.propTypes = {

}

export interface Props {
    history: History;
    location: Location
}