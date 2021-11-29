sap.ui.define([
	"./MyController",
], function (MyController) {
	"use strict";

	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.CommunicateRight", {
		data: () => {
			const n1 = Math.ceil(Math.random() * 100)
			const n2 = Math.ceil(Math.random() * 100)
			return {
				valueA: n1,
				valueB: n2,
				result: n1 + n2    // default is plus, set in store.json
			}
		},

		onInit: function () {
			this.setModel(new sap.ui.model.json.JSONModel(this.data()), "CommunicateRightModel")
			this.model = this.getModel("CommunicateRightModel")
		},

		doPlus: function () {
			this.model.setProperty("/result", this.model.getProperty("/valueA") + this.model.getProperty("/valueB"))
		},

		doMinus: function () {
			this.model.setProperty("/result", this.model.getProperty("/valueA") - this.model.getProperty("/valueB"))
		},

		doMultiply: function () {
			this.model.setProperty("/result", this.model.getProperty("/valueA") * this.model.getProperty("/valueB"))
		},

		doDivide: function () {
			this.model.setProperty("/result", (this.model.getProperty("/valueA") / this.model.getProperty("/valueB")).toFixed(2))
		},

		onAfterRendering: function () {
			this.$storeSubscribe("CommunicateTestData", (cName, tName, context) => {
				const payload = context.payload
				switch(payload) {
					case "+": {
						this.doPlus()
						break;
					}
					case "-": {
						this.doMinus()
						break;
					}
					case "*": {
						this.doMultiply()
						break;
					}
					case "/": {
						this.doDivide()
						break;
					}
				}
			})
		}
	});
});
