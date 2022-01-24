/*global QUnit*/

sap.ui.define([
    "com/bosch/sbs/gng8hc/ui/controller/App.controller"
], function (App) {
	"use strict";

	QUnit.module("App Controller");

	QUnit.test("I should test the App controller onInit()", function (assert) {
		var oAppController = new App();
		console.log("oAppController", oAppController, oAppController.getMetadata().getName())
		oAppController.onInit();
		assert.ok(oAppController);
    });
    

    QUnit.test("I should test the App controller getLoginUserInfo()", function (assert) {
		var oAppController = new App();
		oAppController.getLoginUserInfo();
		assert.ok(oAppController);
    });

    QUnit.test("I should test the App controller onAfterRendering()", function (assert) {
		var oAppController = new App();
		oAppController.onAfterRendering();
		assert.ok(oAppController);
    });
    
    // QUnit.test("I should test the App controller onUserMenuDialogShow()", function (assert) {
	// 	var oAppController = new Controller();
	// 	oAppController.onUserMenuDialogShow();
	// 	assert.ok(oAppController);
    // });

});
