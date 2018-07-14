import { styles } from './map-const';

interface Coords {
	lat: number;
	lng: number;
}

const TORONTO_COORDS = {
	lat: 43.653226,
	lng: -79.38318429999998
}

class Map {
	_completeLoad: () => void;
	_loaded = new Promise(res => {
		this._completeLoad = res;
	});

	loadMap = () => {
		this._completeLoad();
	}

	constructor(){
		// ...
	}
	
	async initMap(el: HTMLElement){
		await this._loaded

		if (!el){
			throw new Error('Must specify valid element to init map')
		}

		// get coordinates
		const coords = await this._defaultCoords()

		// init map
		return new google.maps.Map(el, {
			center: coords,
			zoom: 13,
			mapTypeControl: false,
			styles: styles
		});
	}

	teardown(){
		// TODO
	}

	async _defaultCoords(): Coords {
		if ('geolocation' in navigator) {
			const coords = await this._getLocation()
			if (coords){
				return coords
			}
		}
		return TORONTO_COORDS
	}
	
	_getLocation(): Promise<Coords|null> {
		return new Promise(resolve => {
			navigator.geolocation.getCurrentPosition(position => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				})
			}, err => {
				console.error('Error getting location', err)
				resolve(null)
			}, {
				timeout: 5000,
				maximumAge: 1000 * 60 * 10
			});
		})
	}
}

const m = new Map();
window.loadMap = m.loadMap

export default m


