sap.ui.define([
	"./MyController",
	'sap/ui/core/Fragment',
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text"
], function (MyController, Fragment , ValueState, Dialog, DialogType, Button, ButtonType, Text) {
	"use strict";

	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.Form", {

		onInit: function (oEvent) {

			// set explored app's demo model on this sample
			var modelData = {
				"SupplierName": "Red Point Stores",
				"Street": "Main St",
				"HouseNumber": "1618",
				"ZIPCode": "31415",
				"City": "Maintown",
				"Country": "Germany",
				"Url": "http://www.sap.com",
				"Twitter": "@sap",
				"Tel": "+49 6227 747474",
				"Sms": "+49 173 123456",
				"Mobile": "+49 173 123456",
				"Pager": "+49 173 123456",
				"Fax": "+49 123 456789",
				"Email": "john.smith@sap.com",
				"Rating": 4,
				"Prime": "true",
				"Disposable": 30,
				"column": 6
			};
			var oModel = new sap.ui.model.json.JSONModel(modelData);
			oModel.attachRequestCompleted(function() {
				this.byId('edit').setEnabled(true);
			}.bind(this));
			this.getView().setModel(oModel, "data")
			//this.getView().setModel(oModel);

			//this.getView().bindElement("/SupplierCollection/0");

			this._formFragments = {};

			// Set the initial form to be the display one
			this._showFormFragment("Display");
		},

		commitColumnNum : function () {
			var columnValidList = ["6", "3", "4", "5"];
			var oModel = this.getView().getModel("data");
			var oData = oModel.getData();
			if (columnValidList.indexOf(oData.column) == -1) {
				this.handleDialogPress('3 <= The number <= 6 as a Integer', "error");
				oData.column = 6;
				oModel.setData(oData);
				return;
			}
			oData.column = parseInt(oData.column);
			oModel.setData(oData);
		},

		handleEditPress : function () {

			//Clone the data
			this._oSupplier = Object.assign({}, this.getView().getModel("data").getData());
			this._toggleButtonsAndView(true);

		},

		handleCancelPress : function () {

			//Restore the data
			var oModel = this.getView().getModel("data");
			var oData = oModel.getData();

			oData = this._oSupplier;

			oModel.setData(oData);
			this._toggleButtonsAndView(false);

		},

		handleSavePress : function () {

			this._toggleButtonsAndView(false);

		},

		_toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragment(bEdit ? "Change" : "Display");
		},

		_getFormFragment: function (sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "com.bosch.sbs.sbsfioritemplate.ui.fragment." + sFragmentName
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.byId("page");

			oPage.removeAllContent();
			this._getFormFragment(sFragmentName).then(function(oVBox){
				oPage.insertContent(oVBox);
			});
		},

		handleDialogPress: function (errMessage, type) {
			var state = ValueState.Error;
			if (type == "hint") {
				state = ValueState.Success
			}
			const dialog = new Dialog({
				type: DialogType.Message,
				title: type,
				state: state,
				content: new Text({ text: errMessage }),
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "OK",
					press: function () {
						dialog.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

	});

});