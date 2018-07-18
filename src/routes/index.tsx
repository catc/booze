import React, { Component, Fragment } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'

import HomeRoute from 'routes/home/index'
import ProductView from 'routes/detailed/index'
import NotFound from 'routes/four-oh-four/index'
import ProductModal from 'routes/detailed-modal/index'

@observer
export default class Routes extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        const { location } = this.props;
        // set previousLocation if props.location is not modal
        if (
            nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location;
        }
    }

    render() {
        const { location } = this.props;
        const isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location
        ); // not initial render

        return (
            <Fragment>
                <Switch location={isModal ? this.previousLocation : location}>
                    <Route path="/" exact component={HomeRoute} />
                    <Route path="/p/:id" component={ProductView} />
                    <Route component={NotFound} />
                </Switch>

                {/* product modal view */}
                {isModal ? <Route path="/p/:id" component={ProductModal} /> : null}
            </Fragment>
        )
    }
}

Routes.propTypes = {

}

export interface Props {
    someProp: string;
}
