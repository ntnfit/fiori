sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"jquery.sap.global"
], function (Controller, History, jQuery) {
	"use strict";

	const $ = jQuery;

	// const devMode = false;
	// const authToken = {
	// 	Authorization: ""
	// };

	const devMode = true;
	const authToken = {
		Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYm9zY2gtY2lkYWU0LXM0eC1kZXYuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoia2V5LWlkLTEiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI1N2YxOWE4ZGY3NmE0YzNmOGY4ZGIyZjRiMDdkMmI3MCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiIxOTU2MGJiYS04OGY2LTRmOTktOGIzZS03MDBjY2I2MmM5NmUiLCJ6ZG4iOiJib3NjaC1jaWRhZTQtczR4LWRldiJ9LCJ4cy5zeXN0ZW0uYXR0cmlidXRlcyI6eyJ4cy5yb2xlY29sbGVjdGlvbnMiOlsiU3ViYWNjb3VudCBTZXJ2aWNlIEFkbWluaXN0cmF0b3IiLCJHVFNfSGFja2F0aG9uX0FkbWluIiwiUkJfU1lTX1RNU19PUF9NVEFSX0JUMTAyUDBfQlQxMDJQMDAiLCJBcHBMaWJyYXJ5X09BdXRoMiIsIkF1dG9NZXRhbFByaWNlIEFkbWluaXN0cmF0b3IiLCJTdWJhY2NvdW50IFZpZXdlciIsIkdUU19UZXN0IiwiQnVzaW5lc3NfQXBwbGljYXRpb25fU3R1ZGlvX0RldmVsb3BlciIsIlJCX1NZU19UTVNfT1BfTVRBUl9CVDEwM1EwX0JUMTAzUTAwIiwiZGVsdGFfdmlld2VyIiwiQ2xvdWQgQ29ubmVjdG9yIEFkbWluaXN0cmF0b3IiLCJSQl9BcHBMaWJyYXJ5X0FkbWluIiwiUkJfU0JTQ29FX3Nic2Zpb3JpdGVtcGxhdGUiLCJHVFNfQWRtaW4iLCJSQl9UcmFuc3BvcnRfRXhwb3J0X09wZXJhdG9yIiwiUkJfU1lTX1RNU19PUF9NVEFSX0JUMTAyUTBfQlQxMDJRMDAiLCJTdWJhY2NvdW50IEFkbWluaXN0cmF0b3IiLCJSQl9VRF9TQlNGaW9yaVRlbXBsYXRlX0FkbWluIiwiUkJfVHJhbnNwb3J0X0ltcG9ydF9PcGVyYXRvciIsIldlYklERV9EZXZlbG9wZXIiXX0sImdpdmVuX25hbWUiOiJDQ042U1pIIiwieHMudXNlci5hdHRyaWJ1dGVzIjp7fSwiZmFtaWx5X25hbWUiOiJ0aGlzLWRlZmF1bHQtd2FzLW5vdC1jb25maWd1cmVkLmludmFsaWQiLCJzdWIiOiI2NDU0MjU2MS0yYTYzLTQyMjctODBlMi0zNDg1MjlhNmRhMjAiLCJzY29wZSI6WyJzYnNmaW9yaXRlbXBsYXRlWFNBUFAhdDEyNzE4LmFkbWluIiwib3BlbmlkIl0sImNsaWVudF9pZCI6InNiLXNic2Zpb3JpdGVtcGxhdGVYU0FQUCF0MTI3MTgiLCJjaWQiOiJzYi1zYnNmaW9yaXRlbXBsYXRlWFNBUFAhdDEyNzE4IiwiYXpwIjoic2Itc2JzZmlvcml0ZW1wbGF0ZVhTQVBQIXQxMjcxOCIsImdyYW50X3R5cGUiOiJhdXRob3JpemF0aW9uX2NvZGUiLCJ1c2VyX2lkIjoiNjQ1NDI1NjEtMmE2My00MjI3LTgwZTItMzQ4NTI5YTZkYTIwIiwib3JpZ2luIjoiYXBjbWlzam41LmFjY291bnRzLm9uZGVtYW5kLmNvbSIsInVzZXJfbmFtZSI6ImNjbjZzemgiLCJlbWFpbCI6IkNDTjZTWkhAdGhpcy1kZWZhdWx0LXdhcy1ub3QtY29uZmlndXJlZC5pbnZhbGlkIiwiYXV0aF90aW1lIjoxNjM2NDIwMDU4LCJyZXZfc2lnIjoiNDYwOTg4OWMiLCJpYXQiOjE2MzY0MjAwNjAsImV4cCI6MTYzNjQ2MzI2MCwiaXNzIjoiaHR0cDovL2Jvc2NoLWNpZGFlNC1zNHgtZGV2LmxvY2FsaG9zdDo4MDgwL3VhYS9vYXV0aC90b2tlbiIsInppZCI6IjE5NTYwYmJhLTg4ZjYtNGY5OS04YjNlLTcwMGNjYjYyYzk2ZSIsImF1ZCI6WyJzYnNmaW9yaXRlbXBsYXRlWFNBUFAhdDEyNzE4Iiwib3BlbmlkIiwic2Itc2JzZmlvcml0ZW1wbGF0ZVhTQVBQIXQxMjcxOCJdfQ.h9s7Ah-Dc0UPuZUmsAe6LbaOM9pnDsaqjorT67HuI1GNk0E5VVC2MM0ysdpxQvQhHwQuxgoXFfFxMmdVUN7dLayhxaem0QwCoXXDNi4tK76VvGuo7JK8jjul4Lhhbs43r5bDbQQfAX28mL1VHXexYeSXX6YF7xXJsy6SeCQHOzI5_F-vGMkXnDcdrpmpe7l8JxQnckVxhSkGa-49WUgUp5Mtull4_8IPzDk0aKhG4ZBt2h0eybehPDSpX5kKNAca2dHzFLoVNBluM_JpswmYblEQVyHOmbs1NRYYaw7B-mJYQp7k4rv_N9hR4Q4C6zsDy_fmqK9_0bptJFZ0l3W7IAKO1xWGHSxv6lhnApkkZPfGFj8EXMj3rphUeMRElID6NlS3mjljZG0uSyPL2RxIhX41i9PNOPKspTt3CqvKfCoEA9pust4cLmYvOf71gHKxE-NTI-ktarI6u0fBdRpW1RB5B6uyZccUEUcKuQyf1iXk_CCW-euGyN8EupyqTDcQBx3xBCm36jpHjdVZYSQanqiddtaADRtx9O8k-rwvTVzAhbBVeZ4CNfAcCn9sDVJY5UM2XQnEw0Uy2VDakq-iAMsHUFnF8sKz65N7n60cSyEDAWdscyrAIzfEwQqFbMM-3se_NQ5b1x-xyxzhchWydSu4aMfeY87tMF3rZIbRB58"
	};
	
	return Controller.extend("com.bosch.FioriTemplate.libs.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			//debugger;
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.core.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},


		// Function for store
        $storeDispatch: function (name, payload) {
            this._setter(name, payload)
            this.getEventBus().publish("storeChannel", name, { payload: this._getter(name) })
        },

        $storeSubscribe: function (name, func) {
            this.getEventBus().subscribe("storeChannel", name, func)
        },

        $storeUnsubscribe: function (name) {
            this.getEventBus().unsubscribe("storeChannel", name, undefined)
        },

        /**
         * 
         * @param {string} name - property name of store
         */
        _getter: function (name) {
            return this.getModel("store").getProperty(`/${name}`);
        },

        _setter: function (name, value) {
            //debugger;
            this.getModel("store").setProperty(`/${name}`, value);
        },

		/**
		 * 
		 * @returns { sap.ui.core.EventBus }
		 */
		getEventBus: function () {
			return this.getOwnerComponent().getEventBus();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			let sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		/**
		 * Function for change application language.
		 * Paramter local is one of [zh, de, en ...]
		 * If you do not use the function, the language will be user's system language.
		 * Default value is 'en' if you do not pass a local string.
		 * @public
		 * @param { string } local - i18n [zh, de, en]
		 */
		setAppLanguage: function (local = "en") {
			sap.ui.getCore().getConfiguration().setLanguage(local);
		},


		countdown: 30000,  
		
		resetCountdown: 30000,
		/**
		 * 
		 * @param { string } url - http request remote url
		 * @param { array } path - request parameter in path seperate by /
		 * @param { object } params - params in key-value format
		 * @param { object } header - customer request header in key-value format
		 * @returns { Promise } http request promise
		 */
		 $httpGet: function (url, path, params, header) {
			this.resetInactivityTimeout();
			url = this._spliceURL(url, path, params);
			header = this._mergeHeader(header);
			return new Promise((resolve, reject) => {
				$.ajax({
					url: url,
					type: "GET",
					headers: header,
					success: res => {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}

					},
					error: res => {
						reject(res);
					}
				});
			});
		},

		
		/**
		 * 
		 * @param { string } url - http request remote url
		 * @param { array } path - request parameter in path seperate by /
		 * @param { object } params - params in key-value format
		 * @param { any } body - request body
		 * @param { object } header - customer request header in key-value format
		 * @returns { Promise } http request promise
		 */
		 $httpPost: function (url, path, params, body, header) {
			this.resetInactivityTimeout();
			url = this._spliceURL(url, path, params);
			header = this._mergeHeader(header);
			return new Promise((resolve, reject) => {
				$.ajax({
					url: url,
					type: "POST",
					headers: header,
					data: JSON.stringify(body),
					success: res => {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: res => {
						reject(res);
					}
				});
			});
		},

		/**
		 * 
		 * @param { string } url - http request remote url
		 * @param { any } fileobj - request fileobj
		 * @returns { Promise } http request promise
		 */
		$httpPostFile: function (url, fileobj) {
			const fd = new FormData();
			for (let key in fileobj) {
				fd.append(key, fileobj[key]);
			}
			this.resetInactivityTimeout();
			return new Promise((resolve, reject) => {
				$.ajax({
					method: "POST",
					data: fd,
					url: url,
					processData: false,
					contentType: false,
					success: res => {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: res => {
						reject(res);
					}
				});
			});
		},

		/**
		 * 
		 * @param { string } url - http request remote url
		 * @param { array } path - request parameter in path seperate by /
		 * @param { object } params - params in key-value format
		 * @param { any } body - request body
		 * @param { object } header - customer request header in key-value format
		 * @returns { Promise } http request promise
		 */
		 $httpPatch: function (url, path, params, body, header) {
			url = this._spliceURL(url, path, params);
			header = this._mergeHeader(header);
			this.resetInactivityTimeout();
			return new Promise((resolve, reject) => {
				$.ajax({
					url: url,
					type: "PATCH",
					headers: header,
					data: JSON.stringify(body),
					success: res => {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: res => {
						reject(res);
					}
				});
			});
		},

		/**
		 * 
		 * @param { string } url - http request remote url
		 * @param { array } path - request parameter in path seperate by /
		 * @param { object } params - params in key-value format
		 * @param { any } body - request body
		 * @param { object } header - customer request header in key-value format
		 * @returns { Promise } http request promise
		 */
		 $httpDelete: function (url, path, params, body, header) {
			url = this._spliceURL(url, path, params);
			header = this._mergeHeader(header);
			this.resetInactivityTimeout();
			return new Promise((resolve, reject) => {
				$.ajax({
					url: url,
					type: "DELETE",
					headers: header,
					data: JSON.stringify(body),
					success: res => {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);  // code: 301, msg: "aaa"
						}
					},
					error: res => {
						reject(res);
					}
				});
			});
		},

		_spliceURL: function (url, path, params) {
			for (let e in path) {
				url += ("/" + encodeURIComponent(path[e]));
			}
			url += "?";
			for (let e in params) {
				if (typeof (params[e]) === "object") {
					let t = params[e];
					for (let p in t) {
						url += (e + "=" + encodeURIComponent(t[p]) + "&");
					}
				} else {
					url += (e + "=" + encodeURIComponent(params[e]) + "&");
				}
			}
			if (url.endsWith('?') || url.endsWith('&')) {
				url = url.slice(0, -1);
			}
			return url;
		},

		_mergeHeader: function (h) {
			let header = h || {};
			if (devMode) {
				header["Authorization"] = authToken.Authorization;
			}
			if (!header.hasOwnProperty("Content-Type")) {
				header["Content-Type"] = "application/json";
			}
			return header;
		},

		getInactivityTimeout: function() {
			return this.countdown;
		},
		
		/**
		 * Set number of minutes left till automatic logout
		 */
		setInactivityTimeout: function(timeout_millisec) {
			this.countdown = timeout_millisec;
			this.resetCountdown = this.countdown;
		},
		
		/**
		 * Set number of minutes left till automatic logout
		 */
		resetInactivityTimeout: function() {
			this.countdown = this.resetCountdown;
		},
		
		/**
		 * Begin counting tracking inactivity
		 */
		startInactivityTimer: function() {
			var self = this;
			this.intervalHandle = setInterval(function() { 
				console.log(this.countdown)
				self._inactivityCountdown();
			},  10000);
		},
		
		stopInactivityTimer: function() {
			if (this.intervalHandle != null) {
				clearInterval(this.intervalHandle);
				this.intervalHandle = null;
			}
		},
			
		_inactivityCountdown: function() {
			this.countdown -= 10000;
			if (this.countdown <= 0) {
				this.stopInactivityTimer();
				this.resetInactivityTimeout();

				this.$storeDispatch("showSessionTimeOut", true);
				
				//window.location.href = '/logout';
			}
		},

		/**
		 * 
		 * @param { string } name - Cookie key
		 * @param { string } value - Cookie value 
		 * @param { number } days - expire day
		 */
		setCookie: function (name, value, days) {
			let expires = "";
			if (days) {
				let date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		},

		/**
		 * 
		 * @param { string } name - Cookie key
		 * @returns { string | null } Cookie value
		 */
		getCookie: function (name) {
			let nameEQ = name + "=";
			let ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},

		/**
		 * 
		 * @param { string } name - Cookie key
		 */
		eraseCookie: function (name) {
			this.setCookie(name, '', -1)
		},


	});
});