sap.ui.define([
	"./MyController",
], function (MyController) {
	"use strict";

	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.Map", {
		onInit: function () {

		},

		onAfterRendering: function () {
			mapboxgl.accessToken = 'pk.eyJ1Ijoiem91eWkxMDAiLCJhIjoiY2o2bjVrNXp2MDU2ZTJ3bGE4eXN1c3dndSJ9.GINwEL5g0rQT8IYGLRg1Pw';
			this.map = new mapboxgl.Map({
				container: this.byId("map").getDomRef(),
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [-74.5, 40],
				zoom: 9
			})

			const popUpExample = new mapboxgl.Popup({ offset: 35 })
				.setText('This is an example.');

			const popUpExampleForIcon = new mapboxgl.Popup({ offset: 25 })
				.setText('This is an customize style marker example.');

			const markerExample = new mapboxgl.Marker({ draggable: false })
				.setLngLat([-74.5, 40])
				.setPopup(popUpExample)
				.addTo(this.map)

			// customize icon marker
			const el = document.createElement("div")
			el.id = "iconmarker"
			const iconMarker = new mapboxgl.Marker(el)
				.setLngLat([-74.65, 39.95])
				.setPopup(popUpExampleForIcon)
				.addTo(this.map)

			// controller 
			// geocoder plugin
			this.map.addControl(
				new MapboxGeocoder({
					accessToken: mapboxgl.accessToken,
					mapboxgl: mapboxgl
				})
			);
		}
	});
});
