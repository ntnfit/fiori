sap.ui.define([
    "com/bosch/sbs/sbsfioritemplate/ui/controller/MyController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (MyController,JSONModel,Controller) {
     "use strict";

    QUnit.module("MyController",{
        before : function(){
            this.oMyController = new MyController();
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
            this.oMyController.destroy();
            jQuery.each(this.models, function(i, model) {
                model.destroy();
            });
            Controller.prototype.getView.restore();
        }
    });


    QUnit.test("I should test the MyController _getter()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyViewModel.setProperty(`/appTitle`, "Side-by-Side");
        assert.strictEqual(oMyController._getter("appTitle"), oMyViewModel.getProperty(`/appTitle`));
    });


     QUnit.test("I should test the MyController _setter()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController._setter("appTitle", "Side-by-Side Fiori");
        assert.strictEqual(oMyController._getter("appTitle"), oMyViewModel.getProperty(`/appTitle`));
    });


    QUnit.test("I should test the MyController getUser()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyViewModel.setProperty(`/user`, "HCK2KOR");
        assert.strictEqual(oMyController.getUser(), oMyViewModel.getProperty(`/user`));
    });


    QUnit.test("I should test the MyController setUser()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setUser("ABC2KOR");
        assert.ok(oMyController.getUser());
    });

    QUnit.test("I should test the MyController getLayout()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setLayout("OneColumn");
        assert.ok(oMyController.getLayout());
    });


     QUnit.test("I should test the MyController getUserName()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setUserName("Shreyasi Chakraborty");
        assert.ok(oMyController.getUserName());
    });


    QUnit.test("I should test the MyController getAuthorizations()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setAuthorizations([
        "read",
        "edit"
        ]);
        assert.ok(oMyController.getAuthorizations());
    });

    QUnit.test("I should test the MyController getDetailId()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setDetailId(47000);
        assert.ok(oMyController.getDetailId());
    });


    QUnit.test("I should test the MyController getPurchaseOrders()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setPurchaseOrders([47000,47001,47002]);
        assert.ok(oMyController.getPurchaseOrders());
    });

    QUnit.test("I should test the MyController getSelectedPurchaseOrder()", function (assert) {

        var oMyController = this.oMyController;
        var oModel = new JSONModel();
        oMyController.setModel(oModel, "store");
        var oMyViewModel = oMyController.getModel("store");

        oMyController.setSelectedPurchaseOrder({
            "PurchaseOrder" : 47000,
            "CompanyCode" : "IN"
        });
        assert.ok(oMyController.getSelectedPurchaseOrder());
    });


    QUnit.test("I should test the MyController getUserInfo()", function (assert) {

        var oMyController = this.oMyController;
        
        assert.ok(oMyController.getUserInfo());
    });

    QUnit.test("I should test the MyController getPurchaseOrdersByFilters()", function (assert) {

        var oMyController = this.oMyController;
        
        assert.ok(oMyController.getPurchaseOrdersByFilters());
    });

});