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
		return MyController.extend("com.bosch.sbs.gng8hc.ui.controller.purchaseOrderMaster", {
			onInit: function () {
				console.log("Master: onInit() at ", new Date());
			},

			onBeforeRendering: function(){
				this.initData();
			},

			initData: function (oEvent) {
				this.setMasterPageBusy(true);
				this.getPurchaseOrdersByFilters().then(function(result) {
					console.log("Get Purchase orders: " + result);
					this.setPurchaseOrders(result);
					if(this.getDetailId()){
						const selectedPurchaseOrder = result.find(function(e) {
							return e.PurchaseOrder === this.getDetailId();
						}.bind(this));
						this.setSelectedPurchaseOrder(selectedPurchaseOrder);
					}
					console.log("test");
				}.bind(this)).catch(function(err){
					console.log(err);
				}).finally(function() {
					this.setMasterPageBusy(false);
				}.bind(this));
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

				this.getRouter().navTo("purchaseorderDetail", { detailId: this.getDetailId() });
			},

			onFilterBarSearch: function(oEvent){
				var oStore = this.getModel("store");
				var oBinding = this.byId("tableMaster").getBinding('rows');
				var aFilters = [];

				var sPoNumber = oStore.getProperty("/poNumber");
				if(sPoNumber){
					aFilters.push(new sap.ui.model.Filter({
						path: "PurchaseOrder",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sPoNumber
					}));
				}

				var sCompanyCode = oStore.getProperty("/companyCode");
				if(sCompanyCode){
					aFilters.push(new sap.ui.model.Filter({
						path: "CompanyCode",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sCompanyCode
					}));
				}
				
				oBinding.filter(aFilters);
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
