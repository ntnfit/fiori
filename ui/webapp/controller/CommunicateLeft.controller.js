sap.ui.define([
    "./MyController",
], function (MyController) {
	"use strict";

	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.CommunicateLeft", {
		data: () => {
			return {
				testDataCollection: [{
					name: "Plus",
					value: "+"
				}, {
					name: "Minus",
					value: "-"
				}, {
					name: "Multiply",
					value: "*"
				}, {
					name: "Divide",
					value: "/"
				}]
			}
		},
		
		onInit: function () {
			this.setModel(new sap.ui.model.json.JSONModel(this.data()), "CommunicateLeftModel")
		},

		onSubscribe: function () {
			this.subsStatus = true
		},

		onUnsubscribe: function () {
			this.subsStatus = false
		},

		onSelectChange: function (e) {
			if (this.subsStatus) {
				this.$storeDispatch("CommunicateTestData", e.getParameter("selectedItem").getKey())
			} else {
				this.setCommunicateTestData(e.getParameter("selectedItem").getKey())
			}
		},

		onAfterRendering: function () {
			
		}
	});
});
