import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class WishlistItems extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <div>
                component
			</div>
        )
    }
}

WishlistItems.propTypes = {

}

export interface Props {
    someProp: string;
}