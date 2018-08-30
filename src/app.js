import React, { Component, Fragment } from 'react';
import { Provider, observer } from 'mobx-react';
import { HashRouter, Route, NavLink } from 'react-router-dom'
import 'store/map';

import 'styles/main.scss';
import { Home, Github, Gift } from 'components/icons'

// stores
import WishlistStore from 'store/wishlist';
import RecentlyViewed from 'store/recently-viewed';

// modal
import ModalContainer from 'components/common/modal/modal-container'

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
			<HashRouter>
				<Provider
					wishlist={WishlistStore}
					recentlyViewed={RecentlyViewed}
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
								<a className="app-nav__link" href="https://github.com/catc/booze">
									<Github />
								</a>
							</div>
						</nav>

						{/* routes */}
						<Route component={Routes} />

						{/* other stuff - ie: modal, growls, etc */}
						<ModalContainer/>
					</Fragment>
				</Provider>
			</HashRouter>
		)
	}
}
