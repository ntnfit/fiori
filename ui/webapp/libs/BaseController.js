sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"jquery.sap.global"
], function (Controller, History, jQuery) {
	"use strict";

	const $ = jQuery;

	const devMode = false;
	const authToken = {
		Authorization: ""
	};

	// const devMode = true;
	// const authToken = {
	// 	Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYm9zY2gtY2lkYXYzOS10cmFpbmluZy1zYW5kYm94LmF1dGhlbnRpY2F0aW9uLmV1MTAuaGFuYS5vbmRlbWFuZC5jb20vdG9rZW5fa2V5cyIsImtpZCI6ImtleS1pZC0xIiwidHlwIjoiSldUIn0.eyJqdGkiOiJiM2QyN2I2OWJjYWU0OGY3YjUyMWRlMmFkNTdiYThkZCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiJiMDA1Zjg3YS1lMTJiLTQzZWItYTM3Zi0wMjUyMjJjZTU4OTkiLCJ6ZG4iOiJib3NjaC1jaWRhdjM5LXRyYWluaW5nLXNhbmRib3gifSwieHMuc3lzdGVtLmF0dHJpYnV0ZXMiOnsieHMucm9sZWNvbGxlY3Rpb25zIjpbIlN1YmFjY291bnQgU2VydmljZSBBZG1pbmlzdHJhdG9yIiwiZ2FuOWhjLXJvbGUtY29sbGVjdGlvbiIsIlJCX1VEX3BpcGVyUHVyY2hhc2VPcmRlcl9WaWV3ZXIiLCJEZXN0aW5hdGlvbiBBZG1pbmlzdHJhdG9yIiwiUkJfVURfcGlwZXJQdXJjaGFzZU9yZGVyX0VkaXRvciIsIlN1YmFjY291bnQgVmlld2VyIiwiVXNlciAmIFJvbGUgQWRtaW4iLCJSQl9VRF9waXBlclB1cmNoYXNlT3JkZXJfQWRtaW4iLCJCdXNpbmVzc19BcHBsaWNhdGlvbl9TdHVkaW9fRGV2ZWxvcGVyIiwiQ2xvdWQgQ29ubmVjdG9yIEFkbWluaXN0cmF0b3IiLCJDbG91ZF9Db25uZWN0b3JfYWRtaW4iLCJDb25uZWN0aXZpdHkgYW5kIERlc3RpbmF0aW9uIEFkbWluaXN0cmF0b3IiXX0sImdpdmVuX25hbWUiOiJOYW0iLCJ4cy51c2VyLmF0dHJpYnV0ZXMiOnt9LCJmYW1pbHlfbmFtZSI6Ik5ndXllbiIsInN1YiI6IjczYWM5MjhlLTYwMWMtNDZmZi1hYjJhLWZmNjIwN2U2YmFiZiIsInNjb3BlIjpbInBpcGVyUHVyY2hhc2VPcmRlciF0MjYwMDcuZWRpdCIsIm9wZW5pZCIsInBpcGVyUHVyY2hhc2VPcmRlciF0MjYwMDcuYWRtaW4iLCJwaXBlclB1cmNoYXNlT3JkZXIhdDI2MDA3LnZpZXciXSwiY2xpZW50X2lkIjoic2ItcGlwZXJQdXJjaGFzZU9yZGVyIXQyNjAwNyIsImNpZCI6InNiLXBpcGVyUHVyY2hhc2VPcmRlciF0MjYwMDciLCJhenAiOiJzYi1waXBlclB1cmNoYXNlT3JkZXIhdDI2MDA3IiwiZ3JhbnRfdHlwZSI6ImF1dGhvcml6YXRpb25fY29kZSIsInVzZXJfaWQiOiI3M2FjOTI4ZS02MDFjLTQ2ZmYtYWIyYS1mZjYyMDdlNmJhYmYiLCJvcmlnaW4iOiJsZGFwIiwidXNlcl9uYW1lIjoiTmFtLk5ndXllblZhbkB2bi5ib3NjaC5jb20iLCJlbWFpbCI6Im5hbS5uZ3V5ZW52YW5Adm4uYm9zY2guY29tIiwiYXV0aF90aW1lIjoxNjQwOTI2NjkzLCJyZXZfc2lnIjoiNzQ1YmMxMjAiLCJpYXQiOjE2NDA5MjY2OTUsImV4cCI6MTY0MDkzMDI5NSwiaXNzIjoiaHR0cDovL2Jvc2NoLWNpZGF2MzktdHJhaW5pbmctc2FuZGJveC5sb2NhbGhvc3Q6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJ6aWQiOiJiMDA1Zjg3YS1lMTJiLTQzZWItYTM3Zi0wMjUyMjJjZTU4OTkiLCJhdWQiOlsicGlwZXJQdXJjaGFzZU9yZGVyIXQyNjAwNyIsIm9wZW5pZCIsInNiLXBpcGVyUHVyY2hhc2VPcmRlciF0MjYwMDciXX0.eO9NKR2KU3KoECMbLRNGPfv95aOVQLQ9kle_jjKCnZMZeDEtvc7id-d4XLQyv5BH3ACGhyl7Hz8i_sr60tdwE4GsBKRaF6AUo63We5UOLzU3CMOClL9R3RRlXQUeR_XH5XljGgtj47xAaq6EOr_qiDwmVPTrhlVmtA47vhCqGlKJGy3E0QP9SIdMkvCOCDZcXcE0UyCBgoC6omi_vl2ORgd_zmXEDWKhSJE6XKPdLuXa5Q8esYMoVnD-5ZdnIuhMTgZ9ZJqFdm_u4GL-wtnv-bUBiRapXZvkPR7-lMJQsx4vORtkJdnkGElRjv7m_w8tyABTCThRL_AQLVv7ELr-L2i7msV3-8FevTBUl0QMKkynjBj0JAdJTYHSjZHfgPvJ9UK-i2_cLW-LdgfsMz3uTGq4RNfISQEN5tw0df-D-cukqp3wAsxIg3dG3PG4poxENoX1wabR84YS8EAhliByQ70I6TYsGtxTFhFW3A2uFaXgsQfXkNURAwFESxW2slvf1-EpWGHubXg43kRjkvXdYJ-ACLOQpleuSPYYUAHAwfgo6XioIG5OZjKhid559EB1jJ5EylUJQKI_3FU49EhSPVr3okGZ5mUz8moV-ndYBuC8QLq3qnjZhcvmBoE0groc_VIpeBPDGOZHOguFevubMYzWSOaEOVRJbdhM9FBQ0gY"
	// };
	
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
            return this.getModel("store").getProperty("/"+name);
        },

        _setter: function (name, value) {
            //debugger;
            this.getModel("store").setProperty("/"+name, value);
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
		setAppLanguage: function (local) {
			if(!local) local = "en";
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
			return new Promise(function(resolve, reject){
				$.ajax({
					url: url,
					type: "GET",
					headers: header,
					success: function(res) {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}

					},
					error: function(res){
						reject(res);
					}
				});
			}.bind(this));
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
			return new Promise(function(resolve, reject){
				$.ajax({
					url: url,
					type: "POST",
					headers: header,
					data: JSON.stringify(body),
					success: function(res){
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: function(res) {
						reject(res);
					}
				});
			}.bind(this));
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
			return new Promise(function(resolve, reject){
				$.ajax({
					method: "POST",
					data: fd,
					url: url,
					processData: false,
					contentType: false,
					success: function(res){
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: function(res){
						reject(res);
					}
				});
			}.bind(this));
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
			return new Promise(function(resolve, reject){
				$.ajax({
					url: url,
					type: "PATCH",
					headers: header,
					data: JSON.stringify(body),
					success: function(res) {
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);
						}
					},
					error: function(res) {
						reject(res);
					}
				});
			}.bind(this));
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
			return new Promise(function(resolve, reject){
				$.ajax({
					url: url,
					type: "DELETE",
					headers: header,
					data: JSON.stringify(body),
					success: function(res){
						let code = res.code + "";
						if (typeof (res.code) == "undefined") {
							resolve(res);
						} else if (code[0] == "2") {
							resolve(res.data);
						} else {
							reject(res);  // code: 301, msg: "aaa"
						}
					},
					error: function(res) {
						reject(res);
					}
				});
			}.bind(this));
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