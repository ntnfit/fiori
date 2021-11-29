sap.ui.define([
	"./MyController"
],
	function (MyController) {
		"use strict";

		return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.NotAuthorized", {


			onInit: function () {
			},

            navToIdm: function () {
                window.open("https://rb-im.bosch.com/BOAWeb/welcome","_blank"); 
            },
			reloadPage: function () {
				window.location.replace(window.location.origin)
            }
		});
	});
