sap.ui.define([
	"./MyController",
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery",
	'sap/m/Label',
	'sap/ui/model/Filter',
	"sap/ui/table/library",
	"sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
	"sap/ui/table/RowSettings",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	'sap/ui/core/Fragment',
	"../libs/MasterDialog",
	'sap/m/Token'
], function(MyController, Log, Controller, JSONModel, MessageToast, DateFormat, jQuery, Label, Filter, library, RowAction, RowActionItem, RowSettings
	, ValueState, Dialog, DialogType, Button, ButtonType, Text, Fragment, MasterDialog, Token) {
	"use strict";

	let that;
	var SortOrder = library.SortOrder;

	//sap.ui.table.sample.Basic.Controller
	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.MultiInput", {
		onInit: function () {
			var oView = this.getView();
			var oModel = new JSONModel(sap.ui.require.toUrl("com/bosch/sbs/sbsfioritemplate/ui/mockdata/products.json"));
			oView.setModel(oModel);
			var multiInputSample = oView.byId("multiInputSample");

			// add validator
			var fnValidator = function(args){
				debugger
				var text = args.text;

				return new Token({key: text, text: text});
			};

			multiInputSample.addValidator(fnValidator);
		}

	});

});