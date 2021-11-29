sap.ui.define([
    'sap/m/Dialog',
    'sap/m/Text',
    'sap/m/Button'
], function(Dialog, Text, Button) {
    'use strict';
    
    return {
        __DEFAULTMSG: {
            "000": `Please try again later`
        },

        /**
         * 
         * @param {object} err  http response
         * @returns {void} open the error dialog
         */
        httpErr: function (e) {
            // change to string or '000' if no err code
            let code = e.code || "000"; 
            let msg = e.msg || this.__DEFAULTMSG[code];
            const dialog = new Dialog({
                title: `Message: Error Code ${code}`,
				type: "Message",
				content: new Text({
                    text: msg
				}),
				endButton: new Button({
					text: 'Close',
					press: () => {
                        dialog.close();
                    }
				}),
				afterClose: function() {
					dialog.destroy();
				}
            });
            dialog.open();
        },

        msg: function (msg) {
            const dialog = new Dialog({
                title: `Message`,
				type: "Message",
				content: new Text({
                    text: msg
				}),
				endButton: new Button({
					text: 'Close',
					press: () => {
                        dialog.close();
                    }
				}),
				afterClose: function() {
					dialog.destroy();
				}
            });
            dialog.open();
        },

        errDialog: function (errMessage) {
            const dialog = new Dialog({
                type: sap.m.DialogType.Message,
                title: "Error",
                state: sap.m.GenericTagValueState.Error,
                content: new Text({ text: errMessage }),
                beginButton: new Button({
                    type: sap.m.ButtonType.Emphasized,
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
    };
});