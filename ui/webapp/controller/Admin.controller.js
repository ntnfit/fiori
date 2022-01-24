sap.ui.define([
	"./MyController",
	'sap/ui/core/Fragment',
	"sap/m/Dialog",
	"sap/m/DialogType"
], function (MyController, Fragment, Dialog, DialogType, UIComponent, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	return MyController.extend("com.bosch.sbs.gng8hc.ui.controller.Admin", {
		onInit: function(){
			this.getRouter().initialize();
				this.oRouter = this.getOwnerComponent().getRouter();
		},
        onAfterRendering: function () {
            this.getLoginUserInfo();
        },

        getLoginUserInfo: function () {
            this.getUserInfo().then((result) => {
                //console.log("result is: ", result);
                this.setUser(result);
                //console.log("userName: ", this.getUser().userName);
                //console.log("authorizations: ", this.getUser().authorizations);
                //console.log("attributes: ", this.getUser().attributes);
            }).catch((err) => {
                //console.log(err);
            });
        }
	});
});