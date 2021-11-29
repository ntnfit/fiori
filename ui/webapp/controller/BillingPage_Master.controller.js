sap.ui.define([
	"./MyController",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"jquery.sap.global",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	'sap/m/SearchField',
	'sap/ui/core/Fragment',
	'sap/ui/layout/form/Form',
	"./Formatter",
	"../libs/MasterDialog"
],
	function (MyController, JSONModel, Log, MessageToast, DateFormat, jQuery, ValueState, Dialog, DialogType, Button, ButtonType, Text, SearchField, Fragment, Form, Formatter, MasterDialog) {
		'use strict';
		let that;
		return MyController.extend("com.bosch.sbs.sbsfioritemplate.ui.controller.BillingPage_Master", {
			formatter: Formatter,

			onInit: function () {
				//console.log("billingMaster: onInit() at ", new Date());
				that = this;
				this._oMultiInput = this.getView().byId("multiInput");
				this._billingTable = this.byId("table_BillingMaster");

				let isNotExsistDefault = false;
				this.getVariantList().then((result) => {
					if (result.length !== 0) {
						this.setVariants(result);
						result.forEach(element => {
							if (element.default === true) {
								isNotExsistDefault = true;
								this.setVariantConfig(element);
							}
							if (isNotExsistDefault === false) {
								this.loadMockbColumnbData().then((mockRes) => {
									this.setVariantConfig(mockRes);
								});
							}
						});
					} else {
						this.loadMockbColumnbData().then((mockRes) => {
							this.setVariantConfig(mockRes);
						})
					}
				});
			},

			onAfterRendering: function () {
				//console.log("billingMaster: onAfterRendering() at ", new Date());

				let billingDetailId = this.getBillingDetailId();
				if (billingDetailId === null || typeof billingDetailId === 'undefined') {
					this.initData();
				} else {
				}
			},

			initData: function () {
				this.loadCategoryData().then(taxCodeClass => {
					let TaxCode = taxCodeClass.map(item => { return { id: item } });
					let oModel = new JSONModel();
					oModel.setData({ TaxCode });
					oModel.setSizeLimit(4022);
					this.setModel(oModel, "TaxCodeClassModel");
				});
			 
				let fnValidator = function (args) { return new sap.m.Token({ key: args.text, text: args.text }); };
				this._oMultiInput.addValidator(fnValidator);

				if(this.getSalesOrg() === ""){
					this.getUserInfo().then((result) => {
						let salesOrg = null;
						let attributes = this.getUser().attributes;
						if(attributes.length === 0){

						}else{
							salesOrg = attributes[0].SalesOrg[0];
						}
						this.setSalesOrg(salesOrg);
						this.onFilterBarSearch();
					}).catch((err) => {
						//console.log(err);
					});
				}else{
					this.onFilterBarSearch();
				}
			},

			setVariantConfig: function (variant) {
				this.setBColumns(variant.columns);
				this._billingTable.setFixedColumnCount(variant.freezeColumns);
				//this._setFilterBarLayout(variant.columns)
				if (variant.name !== undefined) {
					this.getModel("store").setProperty("/selectedVariantSetting", variant.name);
				}
			},

			_setFilterBarLayout: function (bColumns) {
				bColumns.forEach(element => {
					let columnName = element.column == undefined ? element.name : element.column;
					let exceptColumns = ["BillingNumber", "InvoiceStatus", "BillingDate", "BuyerName", "TaxRate"];
					if (!exceptColumns.includes(columnName)) {
						let newFilterItem = new sap.ui.comp.filterbar.FilterGroupItem("", {
							visibleInFilterBar: element.filterVisible,
							groupName: "Standard",
							groupTitle: "All filters",
							name: columnName,
							label: columnName,
							control: new sap.m.Input(`filterItem_` + columnName, {})
						});
						this.byId("filterbar").addFilterGroupItem(newFilterItem);
					}
				});
			},

			onTaxCodeChange: function (oEvent) {
				//let TaxCodeChange = oEvent.getParameters().rowBindingContext.getObject();
			},

			onTaxCodeSelected: function (oEvent) {
				var oselected = oEvent.getParameters("changedItem").selectedItem.mProperties;
			},

			formatTaxClassVlue: function (sValue) {

			},

			formatAvailableToObjectState: function (bAvailable) {
				return bAvailable ? "Success" : "Error";
			},

			formatAvailableToIcon: function (bAvailable) {
				return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
			},

			handleDetailsPress: function (oEvent) {
			
			},

			freezeColumns: function (oEvent) {
				let freezetable = this.getView().byId("table_BillingMaster");
				let freezeflag = false;
				let freezeerr = "";

				Fragment.byId("bSettingFragment", "idIconTabBarInlineMode");
				Fragment.byId("bSettingFragment", "inputFreezeColumnNum");
				let sColumnCount = Fragment.byId("bSettingFragment", "inputFreezeColumnNum").getValue() || 0;
				let iColumnCount = parseInt(sColumnCount);
				let iTotalColumnCount = freezetable.getColumns().length;

				if (iColumnCount > iTotalColumnCount) {
					freezeerr = "Freeze columns cannot be larger than total columns!";
					freezeflag = false;
				} else {
					freezeflag = true;
				}

				if (freezeflag) {
					this.getModel("store").setProperty("/BillingPage_tableFreezeCount", iColumnCount);
					freezetable.setFixedColumnCount(iColumnCount);
				} else {
					this.handleErrorDialogPress(freezeerr);
				}
			},

			onBillingNumberPress: function (oEvent) {
				const fcl = this.getView().getParent().getParent();
				let selectedInvoiceNum = oEvent.getSource().getParent().getRowBindingContext().getObject().invoiceNumber;
				this.setBillingDetailId(selectedInvoiceNum);
				this.setLayout("TwoColumnsBeginExpanded");

				//console.log("                           ");
				//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
				//console.log("layout: ", this.getLayout());
				//console.log("billingDetailId: ", this.getBillingDetailId());
				//console.log("navTo:  billingDetail");
				//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
				//console.log("                           ");

				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("billingDetail", { billingDetailId: this.getBillingDetailId() });
			},

			onBillingMasterCellClick: function (oEvent) {
				let selectedDom = oEvent.getParameters().cellDomRef;
				//console.log("selectedDom: ", selectedDom);
				if(0 == selectedDom.getElementsByTagName("span").length){
					//console.log("selectedDom: ", selectedDom);
				}else{
					let selected = oEvent.getParameters().cellDomRef.getElementsByTagName("span")[0].innerText;
					let dummy = document.createElement("textarea");
					document.body.appendChild(dummy);
					dummy.value = selected;
					dummy.select();
					document.execCommand("copy");
					document.body.removeChild(dummy);
				}
			},

			onbSettingDialogPress: function (oEvent) {
				if (!this.bSettingDialog) {
					Fragment.load({
						id: "bSettingFragment",
						name: "com.bosch.gts.ui.fragment.BillingSetting",
						controller: this
					}).then(oDialog => {
						this.bSettingDialog = oDialog;
						this.getView().addDependent(oDialog);
						this.bSettingDialog.open();
					});
				} else {
					this.bSettingDialog.open();
				}
			},

			onbSettingClearButtonPress: function (oEvent) {
				Fragment.byId("bSettingFragment", "inputFreezeColumnNum").setValue("");
				let bColumns = this.getBColumns();
				for (let i = 1; i < bColumns.length; i++) {
					bColumns[i].visible = false;
				}
			},

			onbSettingConfirmButtonPress: function (oEvent) {
				this.freezeColumns();
				this.bSettingDialog.close();
			},

			onbSettingCancelButtonPress: function (oEvent) {
				this.bSettingDialog.close();
			},

			onSVATPress: function (oEvent) {
				let table = this.byId("table_BillingMaster");
				var indices = table.getSelectedIndices();
				var total = 0;
				var selectedContexts = [];
				var flag = false;
				var err = "";
				var length = indices.length;
				let array_buyerVATNumber = [];
				let IsStatusIssued = false;
				let flagCategory = false;
				//console.log("salesOrgInfo",this.getSalesOrgInfo())
				let salesOrgInfo = this.getSalesOrgInfo();
				
				indices.forEach(indice => {
					var context = table.getContextByIndex(indice).getObject();
					//console.log("selected billing context is: ", context);
					selectedContexts.push(context);
					total = total + context.totalAmount;
					if (context.status == "Issued") {
						IsStatusIssued = true;
					}
					if(context.categoryCode === null || context.categoryCode === ""){
						flagCategory = true;
					}
				});
				this.setSelectedBillingContext(selectedContexts);

				selectedContexts.forEach(item => {
					array_buyerVATNumber.push(item.buyerVATNumber);
				});
				
				if (length < 1) {
					err = "No billing item is selected!";
					flag = false;
				} else if (IsStatusIssued) {
					err = "Issued billing item cannot create VAT!"
					flag = false;
				} else if (flagCategory) {
					err = "Billing without category cannot create VAT!"
					flag = false;
				} else if (length > 8) {
					err = "Selected billing items numbers for single VAT cannot be larger than 8!";
					flag = false;
				} else if (total > salesOrgInfo.maxAmount) {
					err = `Total ammount for singe VAT cannot be larger than ${salesOrgInfo.maxAmount}!`;
					flag = false;
				} else if (!this.formatter.isAllEqual(array_buyerVATNumber)) {
					err = "Selected billing items' buyer should be same!"
					flag = false;
				} else {
					flag = true;
				}

				if (flag) {
					let _totalAmountExcludeTax = 0;
					let _totalTax = 0;
					let _totalAmountIncludeTaxLower = 0;
					let _todayDate = new Date().format("yyyy年MM月dd日");
					let _notes = [];

					selectedContexts.forEach(item => {
						_totalAmountExcludeTax += item.totalAmountExcludeTax;
						_totalTax += item.taxAmount;
						_totalAmountIncludeTaxLower += item.totalAmount;
						if (!(item.notes == null || item.notes == undefined || item.notes == "")) {
							_notes.push(item.notes);
						}
					})
					let newSelectedContext = {
						selectedItems: [...selectedContexts],
						totalAmountExcludeTax: _totalAmountExcludeTax.toFixed(2),
						totalTax: _totalTax.toFixed(2),
						totalAmountIncludeTaxLower: _totalAmountIncludeTaxLower.toFixed(2),
						totalAmountIncludeTaxUpper: this.formatter.Number2UpperString(_totalAmountIncludeTaxLower),
						todayDate: _todayDate,
						notes: _notes.join(`;`)
					};
					this.handleSVATDialogPress(newSelectedContext);
				} else {
					table.clearSelection();
					this.handleErrorDialogPress(err);
				}
			},

			onMVATPress: function (oEvent) {
				let table = this.byId("table_BillingMaster");
				var total = 0;
				var selectedContexts = [];
				var flag = false;
				var err = "";
				var indices = table.getSelectedIndices();
				let IsStatusIssued = false;
				let flagCategory = false;

				//console.log("indices: ", indices);

				for (let i = 0; i < indices.length; i++) {
					var context = table.getContextByIndex(indices[i]).getObject();
					//console.log("selected billing context is: ", context);
					selectedContexts.push(context);
					total = total + context.totalAmount;
					if (context.status == "Issued") {
						IsStatusIssued = true;
					}
					if(context.categoryCode === null || context.categoryCode === ""){
						flagCategory = true;
					}
				}

				if (indices.length < 1) {
					err = "No billing item is selected!";
					flag = false;
				} else if (IsStatusIssued) {
					err = "Issued billing can't create VAT!"
					flag = false;
				} else if (flagCategory) {
					err = "Billing without category cannot create VAT!"
					flag = false;
				} else if (indices.length > 8) {
					err = "Selected billing items numbers for single VAT cannot be larger than 8!";
					flag = false;
				} else {
					total = total.toFixed(2);
					let contextTotal = [
						...selectedContexts,
						{
							"id": "",
							"billingNumber": "",
							"invoiceStatus": "",
							"invoiceType": "",
							"category": "",
							"billingDate": "",
							"buyerNumber": "",
							"buyerName": "",
							"buyerVATNumber": "",
							"buyerAddress": "",
							"buyerBankInfo": "",
							"notes": "",
							"redNotificationLetterNumber": "",
							"originalInvoiceCode": "",
							"OriginalInvoiceNumber": "",
							"issuedBy": "",
							"verifier": "",
							"collector": "",
							"payeeBankNameandAccount": "",
							"sellerAddress": "",
							"materialNumber": "",
							"materialDescription": "",
							"matlSpec": "",
							"unitOfMeasure": "",
							"billedQuantity": "",
							"totalAmout": total,
							"taxRate": "",
							"taxAmount": "",
							"totalofDiscountAmount": "",
							"taxAmountonDiscounts": "",
							"versionofTaxClassificationNumber": "",
							"taxClassificationNumber": "",
							"preferentialTreatment": "",
							"preferentialTreatmentDescription": "",
							"zeroTaxRateIdentification": "",
							"deductionAmount": ""
						}
					];
					this.setContexts(contextTotal);
					flag = true;
				}
				if (flag) {
					this.handleMVATDialogPress(selectedContexts);
				} else {
					this.handleErrorDialogPress(err);
				}
			},

			onMVATPreviewPress: function (oEvent){
				let selectedContext = oEvent.getParameter('row').getRowBindingContext().getObject();
				let selectedContexts = [];
				selectedContexts.push(selectedContext);
				let totalAmountExcludeTax = selectedContext.totalAmountExcludeTax;
				let totalTax = selectedContext.taxAmount;
				let totalAmountIncludeTaxLower = selectedContext.totalAmount;
				let todayDate = new Date().format("yyyy年MM月dd日");
				let notes = selectedContext.notes;

				let newSelectedContext = {
					selectedItems: [...selectedContexts],
					totalAmountExcludeTax: totalAmountExcludeTax.toFixed(2),
					totalTax: totalTax.toFixed(2),
					totalAmountIncludeTaxLower: totalAmountIncludeTaxLower.toFixed(2),
					totalAmountIncludeTaxUpper: this.formatter.Number2UpperString(totalAmountIncludeTaxLower),
					todayDate: todayDate,
					notes: notes
				};
				this.handleSVATDialogPress(newSelectedContext);		
			},

			handleMVATDialogPress: function (newSelectedContext) {
				
			},

			handleErrorDialogPress: function (errMessage) {
				const dialog = new Dialog({
					type: DialogType.Message,
					title: "Error",
					state: ValueState.Error,
					content: new Text({ text: errMessage }),
					beginButton: new Button({
						type: ButtonType.Emphasized,
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

			handleSVATDialogPress: function (newSelectedContext) {
				Fragment.load({
					id: "SVATFragment",
					name: "com.bosch.gts.ui.fragment.SVATDialog",
					controller: this
				}).then(oDialog => {
					this.setSelectedBillingContext_sVAT(newSelectedContext);
					this.sVATDialog = oDialog;
					this.getView().addDependent(oDialog);
					this.sVATDialog.open();
				});
			},

			onSVATConfirmButtonPress: function (oEvent) {
				let items = this.getSelectedBillingContext_sVAT().selectedItems;
				let billingDto = items.map(element => {
					return { id: element.id }
				})
				this.postSingleVat(billingDto).then(() => {
					MessageToast.show("create single VAT successfully!");
					this.oPagination.filterTable();
				});
				this.sVATDialog.destroy();

			},

			onSVATCancelButtonPress: function (oEvent) {
				this.sVATDialog.destroy();
			},

			onSVATPrintButtonPress: function () {

			},

			handleMVATDialogPress: function (selectedContexts) {
				Fragment.load({
					name: "com.bosch.gts.ui.fragment.MVATDialog",
					controller: this
				}).then(oDialog => {
					this.setSelectedBillingContext_mVAT(selectedContexts);
					this.mVATDialog = oDialog;
					this.getView().addDependent(oDialog);
					this.mVATDialog.open();
				});
			},

			onMVATConfirmButtonPress: function (oEvent) {
				let items = this.getSelectedBillingContext_mVAT();
				let billingDto = items.map(element => {
					return { id: element.id }
				});
				this.postMultiVat(billingDto).then(() => {
					MessageToast.show("create multi VATs successfully!");
					this.oPagination.filterTable();
				});
				this.mVATDialog.destroy();
			},

			onMVATCancelButtonPress: function (oEvent) {
				this.mVATDialog.destroy();
			},

			onValueHelpRequested: function () {
				this._oBasicSearchField = new SearchField({
					showSearchButton: false
				});

				this._oValueHelpDialog = sap.ui.xmlfragment("com/bosch/gts/ui/fragment/ValueHelpDialogFilterbar", this);
				this.getView().addDependent(this._oValueHelpDialog);

				this._oValueHelpDialog.setRangeKeyFields([{
					label: "Billing Number",
					key: "BillingNumber",
					type: "string"
				}]);

				//TODO remove other valuehelpRangeOperation, just set EQ,Contains
				////console.log(this._oValueHelpDialog,"valuehelpDialog")
				//this._oValueHelpDialog.setRangeKeyFields([{key: "CompanyCode", label: "ID"}, {key:"CompanyName", label : "Name"}])
				//this._oValueHelpDialog.setIncludeRangeOperations([sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ,sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.Contains],"");
				this._oValueHelpDialog.setIncludeRangeOperations([sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ], "");
				//this._oValueHelpDialog.setIncludeRangeOperations([{key: "ValueHelpRangeOperation.EQ", label: "EQ"}, {key: "ValueHelpRangeOperation.Contains", label : "Contains"}],"");
				// var oFilterBar = this._oValueHelpDialog.getFilterBar();
				// oFilterBar.setFilterBarExpanded(false);
				// oFilterBar.setBasicSearch(this._oBasicSearchField);
				this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				this._oValueHelpDialog.open();
			},
			onValueHelpOkPress: function (oEvent) {
				var aTokens = oEvent.getParameter("tokens");
				this._oMultiInput.setTokens(aTokens);
				this._oValueHelpDialog.close();
			},

			onValueHelpCancelPress: function () {
				this._oValueHelpDialog.close();
			},

			onValueHelpAfterClose: function () {
				this._oValueHelpDialog.destroy();
			},

			onFilterBarSearch: function (oEvent) {
				that.setBillingMasterPageBusy(true);
				let oTable = this.byId("table_BillingMaster");
				let selectedBillingNums = [];
				let selectedBillingDate = "";
				let selectedStatus = [];
				let selectedTaxRate = "";
				let selectedSupplier = "";

				let visibleFilters = this.byId("filterbar").getAllFilterItems(true);
				let filter_inputs = [];
				
				for (let index = 5; index < visibleFilters.length; index++) {
					const element = visibleFilters[index];
					let _key = element.getControl().getId().split('_')[1];
					let _value = element.getControl().getProperty("value");
					let input = {
						key: _key,
						value: _value
					};
					filter_inputs.push(input);
				}
				let billingNoTokens = this._oMultiInput.getTokens();
				billingNoTokens.forEach(element => {
					let formattedText = this.formatter.removePunctuation(element.getText())
					selectedBillingNums.push(formattedText);
				});
				selectedBillingDate = this.byId("DatePicker_BillingDate").getValue();
				selectedStatus = this.byId("MultiCom_Status").getSelectedKeys();
				selectedTaxRate = this.byId("ComboBox_TaxRate").getSelectedItem() == null ? "" : this.byId("ComboBox_TaxRate").getSelectedItem().getText();
				selectedSupplier = this.byId("Select_BuyerName").getSelectedKey();

				let _searchDto = {
					otherFilters: [...filter_inputs],
					billingNumbers: selectedBillingNums,
					billingDate: selectedBillingDate,
					status: selectedStatus,
					taxRate: selectedTaxRate
				};
				this._aTableFilters = _searchDto;
				this._setTableSettings(_searchDto);
			},

			onSelect_billingNo: function (e) {
				let selectedSuggestion = e.getParameters().selectedRow.getBindingContext().getObject().billingNumber;
				this._oMultiInput.addToken(new sap.m.Token({ text: selectedSuggestion }));

			},

			/**
			 * 分页模块
			 */
			_aTableData: [],
			_aTableFilters: {},
			_oTableSort: {},
			_devicePhone: false,
			_deviceTablet: true,
			_selectedCount: "",
			_reportData: [],
			_isLoadedData: false,

			/**
			 * sap.ui.table的初始化, 绑定sort,filter事件
			 */
			_setTableSettings: function (params) {
				let pageable = {
					pageSize: this.getModel("store").getProperty("/pageSize"),
					currentPage: this.getModel("store").getProperty("/currentPage")
				};
				this.getBillingByFilters(params, pageable).then((result) => {
					this.getView().setModel(new JSONModel({ "BillingList": result.billings }));
					this.getView().getModel("store").setProperty("/billingListTotalCount", result.totalCount);
					this.getModel("store").setProperty("/BillingList", result.billings);

					this._reportData = result.billings;
					this.addPaginator("table_BillingMaster", result.billings);
				}).catch((err) => {
					//console.log(err)
				}).finally(() => {
					that.setBillingMasterPageBusy(false);
				});
			},

			oPagination: {
				container: {},
				init: function (properties) {
					this.Extend(properties);
					this.Start();
				},

				Extend: function (properties) {
					properties = properties || {};
					this.size = properties.size || 1;
					this.page = properties.page || 1;
					this.step = properties.step || 5;
					this.table = properties.table || {};
					this.countTable = properties.countTable || 0;
					this.countPerPage = properties.countPerPage || 10;
					this.tableData = properties.tableData || 10;
					this.devicePhone = properties.devicePhone;
					this.deviceTablet = properties.deviceTablet;
				},

				Start: function () {
					let isLoadedDataFlag = that._isLoadedData;// default false
					this.table.clearSelection();
					this.container.destroyItems();

					if (this.devicePhone || this.deviceTablet) {
						var oSelect = new sap.m.Select("selectPage", {
							change: this.SelectChange.bind(this),
						});
						this.container.addItem(oSelect);
					}

					if (this.size < this.step * 2 + 6) {
						this.AddNumber(1, this.size + 1);
					} else if (this.page < this.step * 2 + 1) {
						this.AddNumber(1, this.step * 2 + 4);
						this.AddLastNumber();
					} else if (this.page > this.size - this.step * 2) {
						this.AddFirstNumber();
						this.AddNumber(this.size - this.step * 2 - 2, this.size + 1);
					} else {
						this.AddFirstNumber();
						this.AddNumber(this.page - this.step, this.page + this.step + 1);
						this.AddLastNumber();
					}

					this.setFixedButtons();
					if (this.devicePhone || this.deviceTablet) {
						var aSelectItems = oSelect.getItems();
						for (var k = 0; k < aSelectItems.length; k++) {
							var item = aSelectItems[k];
							var r = item.getText();
							if (r === this.page.toString()) {
								oSelect.setSelectedItem(item);
							}
						}
					} else {
						var aButtons = this.container.getItems();
						for (var i = 0; i < aButtons.length; i++) {
							var oButton = aButtons[i];
							if (oButton.getText() === this.page.toString()) {
								oButton.setType("Emphasized");
							}
						}
					}
					if (isLoadedDataFlag) {
						this.filterTable();
					} else {
					}

				},

				AddNumber: function (s, f) {
					for (var i = s; i < f; i++) {
						if (this.devicePhone || this.deviceTablet) {
							sap.ui.getCore().byId("selectPage").addItem(
								new sap.ui.core.Item({
									key: i,
									text: i
								})
							);
						} else {
							var oButton = new sap.m.Button({
								text: i,
								press: this.ClickNumber.bind(this)
							});
							this.container.addItem(oButton);
						}
					}
				},

				AddFirstNumber: function () {
					if (this.devicePhone || this.deviceTablet) {
						sap.ui.getCore().byId("selectPage").insertItem(
							new sap.ui.core.Item({
								key: 1,
								text: 1
							}, 2)
						);
					} else {
						var oButton = new sap.m.Button({
							text: 1,
							press: this.ClickNumber.bind(this)
						});
						this.container.insertItem(oButton, 2);
						oButton = new sap.m.Button({
							text: "...",
						});
						this.container.insertItem(oButton, 3);
					}
				},
				AddLastNumber: function () {
					if (this.devicePhone || this.deviceTablet) {
						sap.ui.getCore().byId("selectPage").insertItem(
							new sap.ui.core.Item({
								key: this.size,
								text: this.size
							}, this.size - 3)
						);
					} else {
						var oButton = new sap.m.Button({
							text: "...",
						});
						this.container.insertItem(oButton, this.size - 4);
						oButton = new sap.m.Button({
							text: this.size,
							press: this.ClickNumber.bind(this)
						});
						this.container.insertItem(oButton, this.size - 3);
					}
				},
				SelectChange: function (oEvent) {
					this.page = parseInt(oEvent.getParameters().selectedItem.getText());
					that._isLoadedData = true;
					this.Start();
				},
				ClickNumber: function (oEvent) {
					this.page = parseInt(oEvent.getSource().getText());
					that._isLoadedData = true;
					this.Start();
				},

				ClickPrev: function () {
					this.page--;
					if (this.page < 1) {
						this.page = 1;
					}
					that._isLoadedData = true;
					this.Start();
				},

				ClickNext: function () {
					this.page++;
					if (this.page > this.size) {
						this.page = this.size;
					}
					that._isLoadedData = true;
					this.Start();
				},

				ClickFirst: function () {
					this.page = 1;
					if (this.page < 1) {
						this.page = 1;
					}
					that._isLoadedData = true;
					this.Start();
				},

				ClickLast: function () {
					this.page = this.size;
					if (this.page > this.size) {
						this.page = this.size;
					}
					that._isLoadedData = true;
					this.Start();
				},

				setFixedButtons: function (e) {
					if (this.devicePhone || this.deviceTablet) {
						var oButton = new sap.m.Button({
							icon: "sap-icon://close-command-field",
							press: this.ClickFirst.bind(this)
						});
						this.container.insertItem(oButton, 0);

						var oButton = new sap.m.Button({
							icon: "sap-icon://navigation-left-arrow",
							press: this.ClickPrev.bind(this)
						});
						this.container.insertItem(oButton, 1);

						oButton = new sap.m.Button({
							icon: "sap-icon://navigation-right-arrow",
							press: this.ClickNext.bind(this)
						});
						this.container.insertItem(oButton, this.size + 2);

						var oButton = new sap.m.Button({
							icon: "sap-icon://open-command-field",
							press: this.ClickLast.bind(this)
						});
						this.container.insertItem(oButton, this.size + 3);
					} else {
						var oButton = new sap.m.Button({
							text: "First",
							press: this.ClickFirst.bind(this)
						});
						this.container.insertItem(oButton, 0);

						oButton = new sap.m.Button({
							text: "Next",
							press: this.ClickNext.bind(this)
						});
						this.container.insertItem(oButton, this.size + 2);

						oButton = new sap.m.Button({
							text: "Previous",
							press: this.ClickPrev.bind(this)
						});
						this.container.insertItem(oButton, 1);

						oButton = new sap.m.Button({
							text: "Last",
							press: this.ClickLast.bind(this)
						});
						this.container.insertItem(oButton, this.size + 3);
					}
				},

				filterTable: function () {
					that.setBillingMasterPageBusy(true);
					let pageable = {
						pageSize: that.getModel("store").getProperty("/pageSize"),
						currentPage: this.page
					};
					that.getModel("store").setProperty("/currentPage", this.page);

					that.getBillingByFilters(that._aTableFilters, pageable).then((result) => {
						that.getView().setModel(new JSONModel({ "BillingList": result.billings }));
						that.getModel("store").setProperty("/BillingList", result.billings);
						that.getView().getModel("store").setProperty("/billingListTotalCount", result.totalCount);
						this._reportData = result.billings;
						this.table.getModel().setData({
							BillingList: result.billings
						});
					}).catch((err) => {
						//console.log(err)
					}).finally(() => {
						that.setBillingMasterPageBusy(false);
					});;
				},

			},
			/**
			 * 生成分页的图标,绑定事件
			 * @param {string} tableId 
			 * @param {Array} tableData 
			 */
			addPaginator: function (tableId, tableData) {
				var oTable = this.byId(tableId);
				var oContentHolder = oTable;

				this._destroyControl("selectPage");
				this._destroyControl("vbox1");
				var oVBox1 = new sap.m.VBox("vbox1", {});
				this._destroyControl("hbox1");
				var oHBox1 = new sap.m.HBox("hbox1", {
					justifyContent: "SpaceBetween",
					width: "90%"
				});

				this._destroyControl("hboxPagination");
				var oHBoxPagination = new sap.m.HBox("hboxPagination", {
					justifyContent: "Center",
					width: "75%"
				});

				this._destroyControl("hbox2");
				var oHBox2 = new sap.m.HBox("hbox2", {
					justifyContent: "SpaceBetween",
					width: "15%"
				});

				this._destroyControl("hbox3");
				var oHBox3 = new sap.m.HBox("hbox3", {
					alignItems: "Center",
					width: "45%"
				});

				this._destroyControl("label1");
				var oLabel1 = new sap.m.Label("label1", {
					text: "Size/Page"
				});

				this._destroyControl("hbox4");
				var oHBox4 = new sap.m.HBox("hbox4", {
					width: "45%"
				});

				if (this._selectedCount === "") {
					this._selectedCount = "15";
				}

				this._destroyControl("comboboxCount");
				var oComboBoxCount = new sap.m.ComboBox("comboboxCount", {
					selectedKey: this._selectedCount,
					width: "10em",
					change: this.changeComboBoxCount.bind(this)
				});

				oComboBoxCount.addItem(new sap.ui.core.Item({
					key: "5",
					text: "5"
				}));
				oComboBoxCount.addItem(new sap.ui.core.Item({
					key: "10",
					text: "10"
				}));
				oComboBoxCount.addItem(new sap.ui.core.Item({
					key: "15",
					text: "15"
				}));
				oComboBoxCount.addItem(new sap.ui.core.Item({
					key: "50",
					text: "50"
				}));
				oComboBoxCount.addItem(new sap.ui.core.Item({
					key: "100",
					text: "100"
				}));

				if (this._devicePhone) {
					oHBoxPagination.setWidth("");
					oHBox1.setJustifyContent("Center");
					oHBox1.addItem(oHBoxPagination);
					oHBox1.addItem(oLabel1);
					oComboBoxCount.setSelectedKey("5");
					oVBox1.addItem(oHBox1);
					oContentHolder.setFooter(oVBox1);
				} else {
					oHBox3.addItem(oLabel1);
					oHBox4.addItem(oComboBoxCount);
					oHBox2.addItem(oHBox3);
					oHBox2.addItem(oHBox4);
					oHBox1.addItem(oHBoxPagination);
					oHBox1.addItem(oHBox2);
					oVBox1.addItem(oHBox1);
					oContentHolder.setFooter(oVBox1);
				}

				this.generatePaginator(tableData);
			},

			/**
			 * pageSize 的下拉框改变触发事件,进行分页按钮重新生成
			 */
			changeComboBoxCount: function (oEvent) {
				let reportData = this._reportData;
				this._selectedCount = oEvent.getSource().getSelectedKey();
				that.getModel("store").setProperty("/pageSize", this._selectedCount);
				this.generatePaginator(reportData);
			},
			generatePaginator: function (tableData) {
				var oTablex = this.getView().byId("table_BillingMaster");
				let totalcount = this.getView().getModel("store").getProperty("/billingListTotalCount");

				if (tableData === undefined)
					return;
				
				var countTable = totalcount;
				var oComboBoxCount = sap.ui.getCore().byId("comboboxCount");

				if (oComboBoxCount === undefined) {
					count = undefined;
				} else {
					if (oComboBoxCount.getSelectedKey() !== undefined && oComboBoxCount.getSelectedKey() !== null) {
						var count = parseInt(oComboBoxCount.getSelectedKey());
					} else {
						count = undefined;
					}
				}

				if (count !== undefined) {
					var countPerPage = count;
				} else {
					if (this._devicePhone) {
						countPerPage = 5;
					} else {
						countPerPage = 10;
					}
				}

				oTablex.setVisibleRowCount(countPerPage);
				var size = parseInt(countTable / countPerPage);

				if (countTable % countPerPage !== 0) {
					size++;
				}

				this.oPagination.container = sap.ui.getCore().byId("hboxPagination");
				this.oPagination.container.destroyItems();
				this.oPagination.init({
					size: size,
					page: 1,
					step: 3,
					table: oTablex,
					countTable: countTable,
					countPerPage: countPerPage,
					tableData: tableData,
					devicePhone: this._devicePhone,
					deviceTablet: this._deviceTablet
				});
			},

			_destroyControl: function (id) {
				var oControl = this.getView().byId(id);
				if (oControl !== undefined) oControl.destroy();
				oControl = sap.ui.getCore().byId(id);
				if (oControl !== undefined) oControl.destroy();
			},

			showBillingStatus: function (status) {
				let bStatus;
				if (status == 0) { bStatus = "open"; }
				else if (status == 1) { bStatus = "Issued"; }
				else if (status == 2) { bStatus = "Error"; }
				return bStatus;
			},

			onHandleVariant: function (oEvent) {
				let oButton = oEvent.getSource();
				this._generatePopOver();
				this.newPopover.openBy(oButton);
			},

			_generatePopOver: function () {
				if (!this.newPopover) {
					let variantList = this.getVariants();
					let popOverItems = [];
					variantList.forEach(element => {
						popOverItems.push(new sap.ui.core.Item("", {
							key: element.id,
							text: element.name
						}));
					});

					this.newPopover = new sap.m.ResponsivePopover("popOver_Variant", {
						showHeader: true,
						title: "My Views",
						contentWidth: "30%",
						contentHeight: "20%",
						placement: sap.m.PlacementType.Bottom,
						content: new sap.m.SelectList("List_myVariant", {
							items: popOverItems,
							selectedKey: "1",
							itemPress: (e) => {
								let selectedItem = e.getParameter("item");
								this.getModel("store").setProperty("/selectedVariantSetting", selectedItem.getText());
								e.getSource().setSelectedKey(selectedItem.getKey());

								variantList.forEach(element => {
									if (element.id == selectedItem.getKey()) {
										if (element.columns !== [] || undefined || null) {
											this.getModel("store").setProperty("/bColumns", element.columns);
											this.byId("table_BillingMaster").setFixedColumnCount(element.freezeColumns)
											this.getVariantList().then((result) => {
												this.setVariants(result);
											});
										}
									}
								});
								this.newPopover.close();
							}
						}),
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "Save As",
							press: function () {
								this.newPopover.close();
								this._Variant_saveView();
							}.bind(this)
						}),
						endButton: new Button({
							type: ButtonType.Emphasized,
							text: "Manage",
							press: function () {
								this.newPopover.close();
								this._Variant_manageView();
							}.bind(this)
						})

					});

					this.newPopover.addStyleClass("sapUiPopupWithPadding");
				}
			},

			_Variant_saveView: function () {
				let currentViewName = this.getModel("store").getProperty("/selectedVariantSetting");
				let oModel = {
					newData: {
						ViewName: `${currentViewName}*`,
						SetDefault: false
					}
				}
				let labelMap = {
					ViewName: "View",
					SetDefault: "Set as Default"
				}
				let jsonOmodel = new JSONModel(oModel);
				this.setModel(jsonOmodel, "variantModel");

				let newSaveViewDialog = MasterDialog.editDialog("Save View", "Message", this.getModel("variantModel"), "variantModel", "/newData", labelMap, [], () => {
					newSaveViewDialog.close();
					let freezeCount = this.getModel("store").getProperty("/BillingPage_tableFreezeCount");
					let saveDto = {
						"name": oModel.newData.ViewName,
						"default": oModel.newData.SetDefault,
						"favourite": false,
						"freezeColumns": freezeCount,
						"columns": this.getModel("store").getProperty("/bColumns")
					};
					
					this.addVariant(saveDto).then((result) => {
						//console.log(saveDto, "saveDto", result, "add variant")
						MessageToast.show("save successfully");
						this.getVariantList().then((result) => {
							this.setVariants(result);
							this.newPopover.destroy();
							this.newPopover = undefined;
							this._generatePopOver();

						});
					})
				}, () => {
					newSaveViewDialog.close();
				}, []);
				this.getView().addDependent(newSaveViewDialog);
				newSaveViewDialog.open();
			},

			_Variant_manageView: function (oEvent) {
				if (!this._oDialog) {
					Fragment.load({
						name: "com.bosch.gts.ui.fragment.VariantManagement",
						controller: this
					}).then(function (oDialog) {
						this._oDialog = oDialog;
						this.getView().addDependent(oDialog);
						this._oDialog.open();
					}.bind(this));
				} else {
					this.getView().addDependent(this._oDialog);
					this._oDialog.open();
				}
			},

			onSave_variantMngt: function () {
				let arrDto = this.getVariants();
				let calls = [];
				arrDto.forEach(element => {
					let call = this.updateVariant(element.id, {
						"default": element.default,
						"favourite": element.favourite,
						"name": element.name,
						"freezeColumns": element.freezeColumns
					});
					calls.push(call)
				});
				Promise.all(calls).then((values) => {
					MessageToast.show(`update variant sucessfully!`)
					this.getVariantList().then((result) => {
						this.setVariants(result);
						this.newPopover.destroy();
						this.newPopover = undefined;
						this._generatePopOver();
					});
				});
			},

			onDelete_variantMngt: function (e) {
				let row = e.getSource().getParent();
				let rowId = row.getCells()[0].getText()
				//console.log(row)
				this.deleteVariant(rowId).then(() => {
					MessageToast.show(`delete variant successfully!`)
					this.getVariantList().then((result) => {
						this.setVariants(result);
						this.newPopover.destroy();
						this.newPopover = undefined;
						this._generatePopOver();
					});
				})
			},

			onCancel_variantMngt: function (e) {
				e.getSource().getParent().close();
				e.getSource().getParent().destroy();
				this._oDialog = undefined;
			},

			onCheckBoxSelect: function (e) {
				let selectedId = e.getSource().getParent().getIndex();
				e.getSource().getParent().getParent().setSelectedIndex(selectedId);//TODO 只能选中一个?
			},

			onBillingUpdate_category: function (oEvent) {
				this.setBillingMasterPageBusy(true);
				let billingId = oEvent.getSource().getParent().getRowBindingContext().getObject().id;
				let updateDto = {
					categoryCode: oEvent.getParameter("value")
				};
				this.updateBilling(billingId, updateDto).then(() => {
					this.oPagination.filterTable();
				}).finally(() => {
					this.setBillingMasterPageBusy(false);
				});
			},

			onBillingUpdate_note: function (oEvent) {
				this.setBillingMasterPageBusy(true);
				let billingId = oEvent.getSource().getParent().getRowBindingContext().getObject().id;
				let updateDto = {
					notes: oEvent.getParameter("value")
				};
				this.updateBilling(billingId, updateDto).then(() => {
					this.oPagination.filterTable();
				}).finally(() => {
					this.setBillingMasterPageBusy(false);
				});
			},
		});
	});
