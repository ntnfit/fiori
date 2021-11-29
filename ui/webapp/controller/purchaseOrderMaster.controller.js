sap.ui.define([
	"./MyController",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"jquery.sap.global",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	'sap/m/SearchField',
	'sap/ui/core/Fragment',
	'sap/ui/layout/form/Form'
],
	function (MyController, JSONModel, Log, MessageToast, DateFormat, jQuery, ValueState, Dialog, DialogType, Button, ButtonType, Text, SearchField, Fragment, Form) {
		'use strict';
		let that;
		return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.purchaseOrderMaster", {
			onInit: function () {
				console.log("Master: onInit() at ", new Date());
			},

			onAfterRendering: function () {
				console.log("Master: onAfterRendering() at ", new Date());

				let detailId = this.getDetailId();
				if (detailId === null || typeof detailId === 'undefined') {
					this.initData();
				} else {
				}
			},

			initData: function () {
			},

			loadPurchaseOrder: function (oEvent) {
				this.setMasterPageBusy(true);
				this.getPurchaseOrdersByFilters().then((result) => {
					console.log("Get Purchase orders: " + result);
					this.setPurchaseOrders(result);
				}).catch((err) => {
					//console.log(err)
				}).finally(() => {
					this.setMasterPageBusy(false);
				});
			},

			onPurchaseOrderPress: function (oEvent) {
				const fcl = this.getView().getParent().getParent();
				let selectedPurchaseOrder = oEvent.getSource().getParent().getRowBindingContext().getObject();
				let selectedPurchaseOrderId = selectedPurchaseOrder.PurchaseOrder;

				console.log("selectedPurchaseOrder: ", selectedPurchaseOrder);
				console.log("selectedPurchaseOrderId: ", selectedPurchaseOrderId);

				this.setSelectedPurchaseOrder(selectedPurchaseOrder);
				this.setDetailId(selectedPurchaseOrderId);
				this.setLayout("TwoColumnsMidExpanded");

				console.log("                           ");
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
				console.log("layout: ", this.getLayout());
				console.log("DetailId: ", this.getDetailId());
				console.log("navTo:  purchaseorderDetail");
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
				console.log("                           ");

				let oRouter = this.getRouter();
				oRouter.navTo("purchaseorderDetail", { detailId: this.getDetailId() });
			}

			// handleErrorDialogPress: function (errMessage) {
			// 	const dialog = new Dialog({
			// 		type: DialogType.Message,
			// 		title: "Error",
			// 		state: ValueState.Error,
			// 		content: new Text({ text: errMessage }),
			// 		beginButton: new Button({
			// 			type: ButtonType.Emphasized,
			// 			text: "OK",
			// 			press: function () {
			// 				dialog.close();
			// 			}.bind(this)
			// 		}),
			// 		afterClose: function () {
			// 			dialog.destroy();
			// 		}
			// 	});
			// 	dialog.open();
			// }
		});
	});
