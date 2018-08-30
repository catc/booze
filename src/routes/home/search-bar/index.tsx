import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import P from 'prop-types';
import { withRouter, Router } from 'react-router'

import { Search } from 'components/icons/index';
import { getQueryParam, SEARCH_QUERY_KEY } from 'utils/query-string';
import { History } from 'node_modules/@types/history/index';

/* 
    component is solely responsible for setting
    the url query param and updating the current term
    on parent
*/

@observer
class SearchBar extends Component<Props, {}> {
    @observable term: string = '';
    @action updateTerm = e => this.term = e.target.value
    @action keyDown = e => e.key === 'Enter' ? this.submit() : null

    unlisten: () => void;
    constructor(props: Props) {
        super(props)

        // listen to changes in query params
        this.unlisten = props.history.listen(() => {
            this.search()
        })

        // on startup, check for term in url
        this.search()
    };

    componentWillUnmount() {
        this.unlisten()
    }

    @action submit = () => {
        const term = this.term.trim()

        // update url
        this.props.history.push({
            search: term ? `?${SEARCH_QUERY_KEY}=${term}` : ''
        })
    };

    @action search = () => {
        // check for term
        const term = getQueryParam(SEARCH_QUERY_KEY)

        // update state if page was refeshed
        this.term = term || ''

        // update on parent
        this.props.setSearchTerm(term || null)
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

    static propTypes = {

    }
}

export default withRouter(SearchBar)

export interface Props {
    history: History;
    location: Location;
    setSearchTerm: (term: string|null) => void
}
