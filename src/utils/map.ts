
class Map {
	_completeLoad = null;
	_loaded = new Promise(res => {
		this._completeLoad = res;
	});

	loadMap = () => {
		this._completeLoad();
	}

	constructor(){
		// ...
		/*
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: -34.397, lng: 150.644},
				zoom: 8
			});
		*/
	}
}

const m = new Map();
window.loadMap = m.loadMap

export default m


