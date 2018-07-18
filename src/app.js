import React, { Component, Fragment } from 'react';
import { Provider, observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'
import 'store/map';

import 'styles/main.scss';
import { Home, Info, Gift } from 'components/icons'

// stores
import ModalStore from 'store/modal';
import WishlistStore from 'store/wishlist';

// components
import ModalWrapper from 'components/common/modal/modal-wrapper';

// routes
import Routes from 'routes/index';

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
					wishlist={WishlistStore}
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

						{/* routes */}
						<Route component={Routes} />

						{/* other stuff - ie: modal, growls, etc */}
						<ModalWrapper/>
					</Fragment>
				</Provider>
			</Router>
		)
	}
}
