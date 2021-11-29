sap.ui.define([
    "com/bosch/sbs/sbsfioritemplate/ui/controller/purchaseOrderMaster.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (poMasterController,JSONModel,Controller) {
     "use strict";

    QUnit.module("PurchaseOrderMasterController",{
        before : function(){
            this.oPOMController = new poMasterController();
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
		var opoMasterController = new poMasterController();
		opoMasterController.onInit();
		assert.ok(opoMasterController);
    });

    QUnit.test("I should test the PurchaseOrderMaster controller onAfterRendering()", function (assert) {

        var oPOMController = this.oPOMController;
        var oModel = new JSONModel();
        oPOMController.setModel(oModel, "store");
        var oMyViewModel = oPOMController.getModel("store");

		oPOMController.onAfterRendering();
		assert.ok(oPOMController);
    });

    
    

});