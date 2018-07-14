import React, { Component, Fragment } from 'react';
import { Provider, observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'
import 'store/map';

import 'styles/main.scss';
import { Home, Info, Gift } from 'components/icons'
import Spinner from 'components/common/spinner'

// stores
import ModalStore from 'store/modal';

// components
import ModalWrapper from 'components/common/modal/modal-wrapper';

// routes
import HomeRoute from 'routes/home'
import ProductView from 'routes/detailed'
import NotFound from 'routes/four-oh-four'

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
						<nav className="container app-nav">
							<div>
								<NavLink to="/" exact className="app-nav__link" activeClassName="state_active" >
									<Home/>
								</NavLink>
								<NavLink to="/wishlist" className="app-nav__link" activeClassName="state_active" >
									<Gift />
								</NavLink>
							</div>
							<div>
								<NavLink to="/about" className="app-nav__link" activeClassName="state_active" >
									<Info />
								</NavLink>
							</div>
						</nav>
						<div>
							<Switch>
								<Route path="/" exact component={HomeRoute}/>
								<Route path="/p/:id" component={ProductView}/>
								<Route component={NotFound}/>
							</Switch>
						</div>

						{/* <Spinner/> */}
						

						{/* other stuff - ie: modal, growls, etc */}
						<ModalWrapper/>
					</Fragment>
				</Provider>
			</Router>
		)
	}
}
