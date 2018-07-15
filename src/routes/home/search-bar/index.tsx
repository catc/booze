import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import P from 'prop-types';
import { withRouter } from 'react-router'

import { Search } from 'components/icons/index';
import { getQueryParam, SEARCH_QUERY_KEY } from 'utils/query-string';

/* 
    component is solely responsible for setting
    the url query param
*/

@observer
class SearchBar extends Component<Props, {}> {
    @observable term: string = '';
    @action updateTerm = e => this.term = e.target.value
    @action keyDown = e => e.key === 'Enter' ? this.submit() : null

    constructor(props: Props) {
        super(props)

        const term = getQueryParam(location.search, SEARCH_QUERY_KEY)
        if (term){
            this.term = term;
        }
        this.search()
    };

    @action submit = () => {
        const term = this.term.trim()

        // update url
        this.props.history.push({
            search: term ? `?${SEARCH_QUERY_KEY}=${term}` : ''
        })

        this.search()
    };

    @action search = () => {
        // check for term
        const term = getQueryParam(location.search, SEARCH_QUERY_KEY)

        if (term) {
            this.props.setSearchTerm(term)
        } else {
            this.props.setSearchTerm(null)
        }
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
