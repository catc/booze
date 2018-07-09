import React, { Component, Fragment } from 'react';
import { Provider, observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import 'store/map';

import 'styles/main.scss';

// stores
import ModalStore from 'store/modal';

// components
import ModalWrapper from 'components/common/modal/modal-wrapper';

// routes
import Search from 'routes/search'
import DetailedView from 'routes/detailed'

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182
@observer
export default class App extends Component {
	render(){
		return (
			<Router>
				<Provider
					modalStore={ModalStore}
					// other stores...
				>
					<Fragment>
						<div>
							<nav>
								<Link to="/">Home</Link>
								<Link to="/search">Search</Link>
							</nav>

							{/* can place routes here */}
							<Switch>
								<Route path="/search" component={Search}/>
								<Route path="/product/:id" component={DetailedView}/>
								{/* other routes */}
							</Switch>
						</div>

						{/* other stuff - ie: modal, growls, etc */}
						<ModalWrapper/>
					</Fragment>
				</Provider>
			</Router>
		)
	}
}
