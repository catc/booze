
const MAIN_COLOR ='#6894a9'
const SATURATION_VALUE = -20;
const BRIGHTNESS_VALUE = 5;

// MapTypeStyle
export const styles: google.maps.MapTypeStyle[] = [
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        //set saturation for the labels on the map
        elementType: "labels",
        stylers: [
            { saturation: SATURATION_VALUE }
        ]
    },
    {	//poi stands for point of interest - don't show these lables on the map 
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    },
    {
        //don't show highways lables on the map
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
            { visibility: "off" }
        ]
    },
    {
        //don't show local road lables on the map
        featureType: "road.local",
        elementType: "labels.icon",
        stylers: [
            { visibility: "off" }
        ]
    },
    {
        //don't show arterial road lables on the map
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
            { visibility: "off" }
        ]
    },
    {
        //don't show road lables on the map
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
            { visibility: "off" }
        ]
    },
    //style different elements on the map
    {
        featureType: "transit",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "poi.government",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "poi.sport_complex",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "poi.attraction",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "poi.business",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "transit",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "transit.station",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "landscape",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]

    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            { hue: MAIN_COLOR },
            { visibility: "on" },
            { lightness: BRIGHTNESS_VALUE },
            { saturation: SATURATION_VALUE }
        ]
    }
]