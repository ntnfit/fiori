sap.ui.define([
    "../libs/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.MyController", {

        // used for app router deployment
        // remoteHost: `/comboschsbssbsfioritemplateui/backend`, 

        // used for local debugging
        //remoteHost: `https://sbsfioritemplateservice.cfapps.eu10.hana.ondemand.com`,

        remoteHost: `backend`, 

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

        getUser: function () {
            return this._getter("user");
        },

        setUser: function (user) {
            this._setter("user", user);
        },

        getUserName: function () {
            return this._getter("userName");
        },

        setUserName: function (userName) {
            this._setter("userName", userName);
        },

        getAuthorizations: function () {
            return this._getter("authorizations");
        },

        setAuthorizations: function (authorizations) {
            this._setter("authorizations", authorizations);
        },

        getLayout: function () {
            return this._getter("layout")
        },

        setLayout: function (layout) {
            this._setter("layout", layout)
        },

        getHomePageSideNavExpanded: function () {
            return this._getter("homePageSideNavExpanded")
        },

        setHomePageSideNavExpanded: function (homePageSideNavExpanded) {
            this.$storeDispatch("homePageSideNavExpanded", homePageSideNavExpanded)
        },

        getDetailId: function () {
            return this._getter("detailId")
        },

        setDetailId: function (detailId) {
            this._setter("detailId", detailId)
        },

        setMasterPageBusy: function (masterPageBusy) {
            this._setter("masterPageBusy", masterPageBusy);
        },

        setDetailPageBusy: function (detailPageBusy) {
            this._setter("detailPageBusy", detailPageBusy);
        },

        getPurchaseOrders: function () {
            return this._getter("purchaseOrders")
        },

        setPurchaseOrders: function (purchaseOrders) {
            this._setter("purchaseOrders", purchaseOrders)
        },

        getSelectedPurchaseOrder: function () {
            return this._getter("selectedPurchaseOrder")
        },

        setSelectedPurchaseOrder: function (selectedPurchaseOrder) {
            this._setter("selectedPurchaseOrder", selectedPurchaseOrder)
        },

        //http request
        getUserInfo: function () {
            return this.$httpGet(this.remoteHost + `/authorizations`, null, null, null);
        },

        getPurchaseOrdersByFilters: function () {
            return this.$httpGet(this.remoteHost + `/purchaseorders`, null, null, null);
        },
        getVariantList: function () {
            return this.$httpGet(this.remoteHost + `/view`, null, null, null);
        },

        getBillingByFilters: function (searchDto, pageable) {
            //todo
            //获取参数 billingNumber~7129858158&billingDate:2020-11-17&status:0&taxRate:0.13
            //写成活的,根据是否输入了filter来拼接search条件
            let salesOrg = this.getSalesOrg();
            let billingNumbers = searchDto.billingNumbers;
            let billingDate = searchDto.billingDate;
            let status = searchDto.status;
            let taxRate = searchDto.taxRate;
            let ortherFilters = searchDto.otherFilters;
            let str = [];

            if (!(billingNumbers == null || billingNumbers == undefined || billingNumbers == "" || billingNumbers.length == 0)) {
                str.push(`billingNumber~${billingNumbers}`)
            }
            if (!(billingDate == null || billingDate == undefined || billingDate == "" || billingDate.length == 0)) {
                str.push(`billingDate:${billingDate}`)
            }
            if (!(status == null || status == undefined || status == "" || status.length == 0)) {
                str.push(`status:${status}`)
            }
            if (!(taxRate == null || taxRate == undefined || taxRate == "" || taxRate.length == 0)) {
                str.push(`taxRate:${taxRate}`)
            }
            if (ortherFilters.length !== 0) {
                ortherFilters.forEach(element => {
                    if (!(element.value == null || element.value == undefined || element.value == "" || element.value.length == 0)) {
                        let para = element.key;//首字母小写
                        let formatPara = para.replace(/\b\w+\b/g, function (word) {
                            return word.substring(0, 1).toLowerCase() + word.substring(1);
                        }
                        );
                        str.push(`${formatPara}:${element.value}`)
                    }
                });
            }
            str.push(`salesOrg:${salesOrg}`);
            let formattedSearch = str.join(`&`);
            //console.log("formattedSearch", formattedSearch);
            this.setBillingMasterPageBusy(true);
            return this.$httpGet(this.remoteHost + `/billing`, null, {
                //search: `billingNumber~${billingNumbers}&billingDate:${billingDate}&status:${status}&taxRate:${taxRate}`
                search: formattedSearch,
                Limit: pageable.pageSize, //pageSize
                Page: pageable.currentPage - 1 //init page from page0
            }, null);
        },

        // CommunicateTestData
        getCommunicateTestData() {
            return this._getter("CommunicateTestData")
        },

        setCommunicateTestData(communicateTestData) {
            this._setter("CommunicateTestData", communicateTestData)
        },

        loadMockbColumnbData: function ( ) {
            return this.$httpGet(sap.ui.require.toUrl("com/bosch/sbs/sbsfioritemplate/ui/mockdata/bColumns.json"), null, null, null);
        },

        setBColumns: function (bColumns) {
            this._setter("bColumns", bColumns)
        },

        setBColumnVisible: function (columnName, visible) {
            let columns = this._getter("bColumns");
            for (let i in columns) {
                if (columns[i].name == columnName) {
                    columns[i].filterVisible = visible;
                    break;
                }
            }
            this._setter("bColumns", [...columns]);
        },

        getVariants: function () {
            return this._getter("billingPage_variant")
        },

        setVariants: function (variants) {
            this._setter("billingPage_variant", variants)
        },

        addVariant: function (variantDto) {
            return this.$httpPost(this.remoteHost + `/view`, null, null, variantDto, null);
        },

        updateVariant: function (id, variantDto) {
            return this.$httpPatch(this.remoteHost + `/view`, [id], null, variantDto, null);
        },

        deleteVariant: function (id) {
            return this.$httpDelete(this.remoteHost + `/view`, [id], null, null, null);
        },

        fetchTableData: function(dto) {
            return this.$httpPost(this.remoteHost + `/table/fetch`, null, null, dto, null);
        },
    });
});
