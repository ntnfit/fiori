sap.ui.define([
    "com/bosch/sbs/gng8hc/ui/controller/purchaseOrderMaster.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (purchaseOrderMaster,JSONModel,Controller) {
     "use strict";

    QUnit.module("PurchaseOrderMasterController",{
        before : function(){
            this.oPOMController = new purchaseOrderMaster();
            console.log("oPOMController:", this.oPOMController, this.oPOMController.getMetadata().getName());
            this.models = {};
            var oViewStub = {
                setModel: function(model, name) {
                    this.models[name] = model;
                }.bind(this),
                getModel: function(name) {
                    return this.models[name];
                }.bind(this)
            };
            sinon.stub(Controller.prototype, "getView").returns(oViewStub);
        },
        after: function() {
            this.oPOMController.destroy();
            jQuery.each(this.models, function(i, model) {
                model.destroy();
            });
            Controller.prototype.getView.restore();
        }
    });

    QUnit.test("I should test the PurchaseOrderMaster controller onInit()", function (assert) {
		var opurchaseOrderMaster = new purchaseOrderMaster();
		opurchaseOrderMaster.onInit();

		assert.ok(opurchaseOrderMaster);
    });

    QUnit.test("I should test the PurchaseOrderMaster controller onBeforeRendering()", function (assert) {
        var oPOMController = this.oPOMController;
        var oModel = new JSONModel();
        oPOMController.setModel(oModel, "store");

		oPOMController.onBeforeRendering();
		assert.ok(oPOMController);
    });

});