import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'

import HomeRoute from 'routes/home/index'
// import ProductView from 'routes/detailed/index'
// import ProductView from 'routes/product/index'
import NotFound from 'routes/four-oh-four/index'
import ProductModal from 'routes/product/product-modal/index'
import ProductFullPage from 'routes/product/full-page/index'
// import ProductModal from 'routes/detailed-modal/index'
import { Location, History } from 'node_modules/@types/history/index';

@observer
export default class Routes extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    previousLocation = this.props.location;

    componentWillUpdate(nextProps: Props) {
        const { location } = this.props;
        // set previousLocation if props.location is not modal
        if (
            nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location;
        }
    }

    @computed get isModal(){
        const { location } = this.props;
        return !!(location.state
            && location.state.modal
            && this.previousLocation !== location
        )
    }

    render() {
        const { location } = this.props;
        /* const isModal = !!(
            location.state && location.state.modal && this.previousLocation !== location
        ); */ // not initial render

        return (
            <Fragment>
                <Switch location={this.isModal ? this.previousLocation : location}>
                    <Route path="/" exact component={HomeRoute} />
                    <Route path="/p/:id" component={ProductFullPage} />
                    <Route component={NotFound} />
                </Switch>

                {/* product modal view */}
                {this.isModal ? <Route path="/p/:id" component={ProductModal} /> : null}
            </Fragment>
        )
    }
}

Routes.propTypes = {

}

export interface Props {
    location: Location;
    history: History
}
