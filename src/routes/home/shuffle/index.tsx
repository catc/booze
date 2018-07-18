import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import Results from '../results'
import { randomProducts } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'
import { Shuffle } from 'components/icons/index';

@observer
export default class RandomShuffle extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.fetch()
    }

    @observable isLoading = true;
    @observable results = [];

    @action fetch = async () => {
        this.isLoading = true;
        try {
            const { result } = await randomProducts()
            this.results = result
            this.isLoading = false;

        } catch (err) {
            console.error('Error fetching random products', err)
        }
    }

    refresh(){
        window.location.reload()
    }

    render() {
        return (
            <div className="shuffle">

                <div className="shuffle__header">
                    <h2>Random Drinks</h2>
                    <button
                        onClick={this.fetch}
                        className="button type_med style_hover-light shuffle__button"
                    ><Shuffle/></button>
                </div>

                {this.isLoading ?
                    <Spinner classes="shuffle__loading" />
                    :
                    this.results && this.results.length ?
                        <Results results={this.results} />
                        :
                        <span className="shuffle__empty-results">
                            No results found
                            <button onClick={this.refresh}>Try refreshing the page</button>
                        </span>
                }
			</div>
        )
    }
}

RandomShuffle.propTypes = {

}

export interface Props {
    someProp: string;
}
