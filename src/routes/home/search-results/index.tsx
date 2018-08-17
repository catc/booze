import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { TweenLite } from 'gsap';
import { Power1 } from 'gsap/EasePack';

import Spinner from 'components/common/spinner/index'
import Results from '../results/index'
import { search, ProductPager } from 'api/lcbo'
import { wait } from 'utils/async'
/* 
    TODO
    - add bolded titles of search results
*/

@observer
export default class SearchResults extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.search()
    }

    @observable isSearching = false;
    @observable isLoadingMore = false;
    @observable results = [];
    @observable pager: ProductPager = {};
    
    @action search = async () => {
        this.isSearching = true
        try {
            const { pager, result } = await search(this.props.term)
            // console.log(resp)
            if (result) {
                this.results = result
            }
            this.pager = pager
        } catch (err) {
            console.error('Error fetching search results', err);
        }
        this.isSearching = false
    }

    componentDidUpdate(prevProps: Props){
        if (prevProps.term !== this.props.term){
            this.search()
        }
    }

    @action loadMore = async () => {
        if (this.isLoadingMore){
            return;
        }

        const nextPage = this.pager.next_page
        if (nextPage){
            this.isLoadingMore = true
            try {
                const { pager, result } = await search(this.props.term, nextPage)
                if (result) {
                    this.results = this.results.concat(result)
                }
                this.pager = pager
                this.scrollToNewResults(result.length)
            } catch (err) {
                console.error('Error fetching more search results', err);
            }
            this.isLoadingMore = false
        }
    }

    async scrollToNewResults(newResultsLen: number){
        if (newResultsLen > 2){
            await wait(200)
            const scroll = window.innerHeight / 2

            const body = document.body
            const top = body.scrollTop

            TweenLite.to(body, 0.5, {
                scrollTo: top + scroll,
                ease: Power1.easeOut
            });
        }
    }

    render() {
        if (this.isSearching){
            return <Spinner className="search__spinner"/>
        }
        if (this.results.length === 0){
            return (
                <div className="search__empty">There were no proucts found for <strong>{this.props.term}</strong></div>
            )
        }

        const total = this.pager.total_record_count;
        return (
            <div className="search__found">
                <span className="search__term">{total} result{total === 0 ? '' : 's'} found for <strong>{this.props.term}</strong></span>

                <Results results={this.results} />

                {this.pager.next_page ?
                    <button className="search__load-more" disabled={this.isLoadingMore} onClick={this.loadMore}>
                        {this.isLoadingMore ? 'Loading...' : 'Load More'}
                    </button>
                    :
                    null
                }
			</div>
        )
    }
}

SearchResults.propTypes = {

}

export interface Props {
    term: string;
}
