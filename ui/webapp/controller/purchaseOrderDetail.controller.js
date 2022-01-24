sap.ui.define([
    './MyController',
    "sap/ui/model/json/JSONModel"
], 
function (MyController,JSONModel) {
    'use strict';

    return MyController.extend("com.bosch.sbs.gng8hc.ui.controller.purchaseOrderDetail", {

        onInit: function () {
            console.log("purchaseOrderDetail onInit: ");
            const oRouter = this.getRouter();
            oRouter.getRoute("purchaseorderDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let selectedPurchaseOrderId = this.getDetailId();
            console.log("Before selectedPurchaseOrderId: ", selectedPurchaseOrderId);
            const oRouter = this.getRouter();
            if(selectedPurchaseOrderId === null){
                console.log("Direct access router for detail page.");
                const selected = oEvent.getParameter("arguments").detailId;
                if(selected){
                    this.setDetailId(selected);
                    selectedPurchaseOrderId = this.getDetailId();
                    this.setLayout("TwoColumnsMidExpanded");
                } else {
                    this.handleClose();
                } 
            }
        },

        handleClose: function () {
            let fcl = this.getView().getParent().getParent();
            let oRouter = this.getRouter();
            this.setLayout("OneColumn");
            oRouter.navTo("purchaseorder");
        }
    });

});