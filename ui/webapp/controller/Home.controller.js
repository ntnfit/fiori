sap.ui.define([
	"./MyController",
	'sap/ui/core/Fragment',
	"sap/m/Dialog",
	"sap/m/DialogType"
],
	function (MyController, Fragment, Dialog, DialogType, UIComponent, FlexibleColumnLayoutSemanticHelper) {
		"use strict";

		return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.Home", {
			onInit: function () {
				this.getRouter().initialize();
				this.oRouter = this.getOwnerComponent().getRouter();
				//this.oRouter.attachRouteMatched(this.onRouteMatched, this);
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
			},

			onLanguageSelectDialogShow: function (oEvent) {
				const oButton = oEvent.getSource();
				if (!this._actionSheet) {
					this._actionSheet = sap.ui.xmlfragment(
						"com.bosch.sbs.sbsfioritemplate.ui.fragment.LanguageList",
						this
					);
					this.getView().addDependent(this._actionSheet);
				}

				this._actionSheet.openBy(oButton);
			},

			downloadLanguage: function (oEvent) {
				let link = document.createElement("a");
				//link.setAttribute('download', name);
				link.href = "assets/language_template.xlsx";
				document.body.appendChild(link);
				link.click();
				link.remove();
			},

			manageLanguage: function (oEvent) {
				const oButton = oEvent.getSource();
				if (!this.languageDialog) {
					Fragment.load({
						id: "languageFragment",
						name: "com.bosch.sbs.sbsfioritemplate.ui.fragment.LanguagePreference",
						controller: this
					}).then(oDialog => {
						this.languageDialog = oDialog;
						this.getView().addDependent(oDialog);
						this.languageDialog.open();
					});
				} else {
					this.languageDialog.open();
				}
			},

			selectLanguage: function (oEvent) {
				const local = oEvent.getSource().getId();
				this.setAppLanguage(local);

				//Update App title description 
				jQuery("title")[0].innerHTML = this.getView().getModel("i18n").getResourceBundle().getText("BoschInvcPlatform");
			},

			setAppLanguage: function (local = "en") {
				sap.ui.getCore().getConfiguration().setLanguage(local);
			},

			onLanguagePreferenceCancelButtonPress: function (oEvent) {
				this.languageDialog.close();
			},

			onbSettingClearButtonPress: function (oEvent) {
				Fragment.byId("bSettingFragment", "inputFreezeColumnNum").setValue("");
				let bColumns = this.getBColumns();
				for (let i = 1; i < bColumns.length; i++) {
					bColumns[i].visible = false;
				}
			},

			onbSettingConfirmButtonPress: function (oEvent) {
				this.freezeColumns();
				this.bSettingDialog.close();
			},

			onbSettingCancelButtonPress: function (oEvent) {
				this.bSettingDialog.close();
			},

			onUserMenuDialogShow: function (oEvent) {
				const oButton = oEvent.getSource();
				this.byId("usermenu").openBy(oButton);
			},

			doLogout: function () {
				//console.log("do logout")
				this.eraseCookie("uid")
				this.eraseCookie("uname")
				window.location.replace("/do/logout");
				this.oRouter.navTo("Target_master");
			},


			onSideNavButtonPress: function () {
				this.toggleSideBar();
			},

			onItemSelect: function (oEvent) {
				let navKey = oEvent.getParameter("item").getKey();
				// //console.log("oItem is: ", oItem);
				// //console.log("oItem.getKey() is: ", oItem.getKey());

				if (navKey == "expand") {
					this.onSideNavButtonPress();
				} else {
					let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					//this.oRouter = this.getOwnerComponent().getRouter();
					this.setLayout("OneColumn");
					//console.log("                ");
					//console.log("layout: ", navKey);
					//console.log("nav to: ", navKey);
					oRouter.navTo(navKey);
				}
			},

			onRouteMatched: function (oEvent) {
				let oModel = this.getModel("store");
				let sLayout = this.getLayout();
				//let sLayout = oEvent.getParameters().arguments.layout;
				let fcl = this.byId("fcl");
				// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)




				if (!sLayout) {
					let oNextUIState = this.getOwnerComponent().getHelper(fcl).getNextUIState(0);
					sLayout = oNextUIState.layout;
					//sLayout = "OneColumn";
				}
				// Update the layout of the FlexibleColumnLayout
				if (sLayout) {
					oModel.setProperty("/layout", sLayout);
				}
				//console.log("into home when route map" + new Date());
			},

			onExit: function () {
				this.oRouter.detachRouteMatched(this.onRouteMatched, this);
				//this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
			}


		});
	});
