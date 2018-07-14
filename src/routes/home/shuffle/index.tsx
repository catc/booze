import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

import Results from '../results'
import { randomProducts } from 'api/lcbo'
import Spinner from 'components/common/spinner/index'
import { Shuffle } from 'components/icons/index';

const wait = d => new Promise(res => setTimeout(res, d))
/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class RandomShuffle extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)

        // this.fetch()
    }

    @observable isLoading = true;
    @observable results = [];

    @action async fetch() {
        try {
            const { result } = await randomProducts()
            this.results = result
            this.isLoading = false;

        } catch (err) {
            console.error('Error fetching random products', err)
        }
    }

    render() {
        if (this.isLoading){
            return <Spinner classes="shuffle__loading"/>
        }
        return (
            <div className="shuffle">
                <button className="button type_small"><Shuffle/></button>

                <Results results={this.results} />
			</div>
        )
    }
}

RandomShuffle.propTypes = {

}

export interface Props {
    someProp: string;
}
