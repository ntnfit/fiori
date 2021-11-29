sap.ui.define([
	"./MyController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (MyController, Fragment, JSONModel) {
	"use strict";

	return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.App", {

		data: () => {
			return {
				/**
				 * The value of key must be same as its route name in manifast.json
				 */
				navigationList: [{
					enabled: true,
					title: "Welcome",
					key: "welcome",
					icon: "sap-icon://message-information"
				},{
					enabled: true,
					title: "Table",
					key: "product",
					icon: "sap-icon://table-column"
				}, {
					enabled: true,
					expanded: false,
					title: "Technical Function",
					key: "",
					icon: "sap-icon://multi-select",
					items: [{
						enabled: true,
						title: "Subscribe",
						key: "COMMUNICATE",
						icon: "sap-icon://sales-order"
					}],
				}, {
					enabled: true,
					title: "Map Solution",
					key: "MAP",
					icon: "sap-icon://map-2"
				}, {
					enabled: true,
					title: "Form",
					key: "FORM",
					icon: "sap-icon://map-2"
				}, {
					enabled: true,
					title: "Search",
					key: "SEARCH",
					icon: "sap-icon://map-2"
				}, {
					enabled: true,
					title: "ValueHelp",
					key: "VALUEHELP",
					icon: "sap-icon://map-2"
				}, {
					enabled: true,
					title: "MultiInput",
					key: "MULTIINPUT",
					icon: "sap-icon://map-2"
				}]
			}
		},

		onInit: function () {
			this.router = this.getRouter()
			console.log("app.con..", this.getModel("store"));
			this.setModel(new JSONModel(this.data()), "RootModel")
			this.userMenuDialog = this.byId("userMenu")

			let sessionTimeOut = this.getModel("store").getProperty("/sessionTimeOut");
			this.setInactivityTimeout(sessionTimeOut * 60 * 1000);
			this.startInactivityTimer();

		},

		onSessionDialogClose : function () {
			this._oDialog.close();
		},

		onSignIn: function () {
			window.location.reload();
		},

		onItemSelect: function (e) {
			const selectedKey = e.getSource().getProperty("selectedKey")
			this.router.navTo(selectedKey)
		},

		onAfterRendering: function () {
			this.getLoginUserInfo();
			this.$storeSubscribe("showSessionTimeOut", (cName, tName, context) => {
				if (context.payload) {
					if (!this._oDialog) {
						Fragment.load({
							name: "com.bosch.sbs.sbsfioritemplate.ui.fragment.SessionTimeOutDialog",
							controller: this
						}).then(function (oDialog) {
							this._oDialog = oDialog;
							this.getView().addDependent(oDialog); 
							this._oDialog.open();
						}.bind(this));
					} else {
						this._oDialog.open();
					}
				} 
			});
		},

		onToggleNavigationPress: function () {
			this.setHomePageSideNavExpanded(!this.getHomePageSideNavExpanded())
		},

		// user menu logic
		onUserMenuDialogShow: function (oEvent) {
			const oButton = oEvent.getSource();
			this.byId("usermenu").openBy(oButton);
		},

		onDialogClose: function () {
			this.userMenu.close()
		},

		onUserMenuItemSelect: function (context) {
			const selectItem = context.getParameter("item")
			this.byId("userMenuContent").to(this.getView().createId(selectItem.getKey()))
		},

		getLoginUserInfo: function () {
			this.getUserInfo().then((result) => {
				this.setUser(result);
				let userName = this.getUser().userName;
				userName = userName.toUpperCase();
				let authorizations = this.getUser().authorizations;
				
				this.setAuthorizations(authorizations);
				this.setUserName(userName);
				console.log("userName: " + this.getUserName());
				console.log("authorizations: " + authorizations);
				this.checkAuthorizationValid();
			}).catch((err) => {
				console.log(err);
			});
		},

		checkAuthorizationValid: function () {
			let authorizations = this.getAuthorizations();
			let flag = false;
			console.log("checkAuthorizationValid authorizations: " + authorizations);

			if(authorizations !=null) {
				console.log("A");
				if(!authorizations.includes("valid")){
					console.log("B");
					flag = true;
				}
			}else{
				console.log("C");
				flag = true;
			}
			if(flag){
				// if (!this.NotAuthorizedDialog) {
				// 	this.NotAuthorizedDialog = new Dialog({
				// 		type: DialogType.Message,
				// 		title: "Error",
				// 		state: ValueState.Error,
				// 		content: new Text({ text: "The only error you can make is to not even try." }),
				// 		beginButton: new Button({
				// 			type: ButtonType.Emphasized,
				// 			text: "OK",
				// 			press: function () {
				// 				this.NotAuthorizedDialog.close();
				// 			}.bind(this)
				// 		})
				// 	});
				// }
	
				// this.NotAuthorizedDialog.open();









				// if (!this.NotAuthorizedDialog) {
				// 	Fragment.load({
				// 		id: "NotAuthorizedDialogFragment",
				// 		name: "com.bosch.sbs.sbsfioritemplate.ui.fragment.NotAuthorized",
				// 		controller: this
				// 	}).then(oDialog => {
				// 		this.NotAuthorizedDialog = oDialog;
				// 		this.getView().addDependent(oDialog);
				// 		this.NotAuthorizedDialog.open();
				// 	});
				// } else {
				// 	this.NotAuthorizedDialog.open();
				// }
			}
		},

		doLogout: function () {
			console.log("do logout")
			// this.eraseCookie("uid")
			// this.eraseCookie("uname")
			window.location.replace("/comboschsbssbsfioritemplateui/do/logout");
			//this.oRouter.navTo("Target_master");
		},

	});
});
