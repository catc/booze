import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

// need to do this or webpack strips it out of build
import scrollPlugin from 'gsap/ScrollToPlugin'
scrollPlugin

// budget bluebird
window.Promise.hash = obj => {
	return Promise.all(Object.values(obj)).then(promises => {
		return Object.keys(obj).reduce((o, key, i) => (o[key] = promises[i], o), {});
	})
}

const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('root')
	);
}

render(App);

if (module.hot){
	module.hot.accept('./app', () => render(App))
};
