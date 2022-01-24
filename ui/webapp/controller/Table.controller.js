sap.ui.define([
	"./MyController",
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery",
	'sap/m/Label',
	'sap/ui/model/Filter',
	"sap/ui/table/library",
	"sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
	"sap/ui/table/RowSettings",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	'sap/ui/core/Fragment',
	"../libs/MasterDialog"
], function(MyController, Log, Controller, JSONModel, MessageToast, DateFormat, jQuery, Label, Filter, library, RowAction, RowActionItem, RowSettings
	, ValueState, Dialog, DialogType, Button, ButtonType, Text, Fragment, MasterDialog) {
	"use strict";

	let that;
	var SortOrder = library.SortOrder;

	//sap.ui.table.sample.Basic.Controller
	return MyController.extend("com.bosch.sbs.gng8hc.ui.controller.Table", {
		_aTableData: [],
		_aTableFilters: {},
		_oTableSort: {},
		_devicePhone: false,
		_deviceTablet: true,
		_selectedCount: "",
		_reportData: [],
		_isLoadedData: false,
		onInit : function() {
			// set explored app's demo model on this sample
			//this.initSampleDataModel();
			that = this;
			var oView = this.getView();

			//Initial sorting
			var oProductNameColumn = oView.byId("name");
			oView.byId("table").sort(oProductNameColumn, SortOrder.Ascending);

			var fnPress = this.handleActionPress.bind(this);

			this.modes = [
				{
					key: "Navigation",
					text: "Navigation",
					handler: function(){
						var oTemplate = new RowAction({items: [
							new RowActionItem({
								type: "Navigation",
								press: fnPress,
								visible: "{Available}"
							})
						]});
						return [1, oTemplate];
					}
				},{
					key: "NavigationDelete",
					text: "Navigation & Delete",
					handler: function(){
						var oTemplate = new RowAction({items: [
							new RowActionItem({
								type: "Navigation",
								press: fnPress,
								visible: "{Available}"
							}),
							new RowActionItem({type: "Delete", press: fnPress})
						]});
						return [2, oTemplate];
					}
				},{
					key: "NavigationCustom",
					text: "Navigation & Custom",
					handler: function(){
						var oTemplate = new RowAction({items: [
							new RowActionItem({
								type: "Navigation",
								press: fnPress,
								visible: "{Available}"
							}),
							new RowActionItem({icon: "sap-icon://edit", text: "Edit", press: fnPress})
						]});
						return [2, oTemplate];
					}
				},{
					key: "Multi",
					text: "Multiple Actions",
					handler: function(){
						var oTemplate = new RowAction({items: [
							new RowActionItem({icon: "sap-icon://attachment", text: "Attachment", press: fnPress}),
							new RowActionItem({icon: "sap-icon://search", text: "Search", press: fnPress}),
							new RowActionItem({icon: "sap-icon://edit", text: "Edit", press: fnPress}),
							new RowActionItem({icon: "sap-icon://line-chart", text: "Analyze", press: fnPress})
						]});
						return [2, oTemplate];
					}
				},{
					key: "None",
					text: "No Actions",
					handler: function(){
						return [0, null];
					}
				}
			];

			oView.setModel(new JSONModel({items: this.modes}), "modes");
			this.switchState("Navigation");

			
			//必须放在onInit中,因为filterBar要在渲染之前确定
			let isNotExsistDefault = false;
			//如果result有default,就读取default的东西,覆盖放到store的bColumns里
			//else 使用bColumns里面的值
			this.getVariantList().then((result) => {
				if (result.length !== 0) {
					this.setVariants(result);
					result.forEach(element => {
						if (element.default === true) {
							isNotExsistDefault = true;
							this.setVariantConfig(element);
							//console.log("加载variant中的值")
						}
					});
					//如果虽然有variants,但是没有default的,还是加载mock数据
					if (isNotExsistDefault === false) {
						this.loadMockbColumnbData().then((mockRes) => {
							this.setVariantConfig(mockRes);
						});
					}
				} else {
					this.loadMockbColumnbData().then((mockRes) => {
						this.setVariantConfig(mockRes);
						//console.log("加载json中的值")
					})
				}
			});

		},
		onAfterRendering: function() {
			console.log("after view", this.getModel("store"))
			this.initSampleDataModel();
			// this.loadMockbColumnbData().then((mockRes) => {
			// 	this.setVariantConfig(mockRes);
			// 	//console.log("加载json中的值")
			// });
			// this.getVariantList().then((result) => {
			// 	if (result.length !== 0) {
			// 		this.setVariants(result);
			// 		result.forEach(element => {
			// 			this.setVariantConfig(element);
			// 		});
			// 	} else {
			// 		this.loadMockbColumnbData().then((mockRes) => {
			// 			this.setVariantConfig(mockRes);
			// 		})
			// 	}
			// });
		},

		initSampleDataModel : function() {
			var params = {
				
			};

			params.pageSize = this.getModel("store").getProperty("/pageSize");
			params.currentPage = this.getModel("store").getProperty("/currentPage");
			
			this.fetchTableData(params).then((result) => {
				this.getView().setModel(new JSONModel({ "tableList": result.tableList }));
				this.getView().getModel("store").setProperty("/tableListTotalCount", result.totalCount);
				this.getModel("store").setProperty("/tableList", result.tableList);
				this._reportData = result.tableList;

				this.addPaginator("table", result.tableList);


			}).catch((err) => {
				console.log(err)
			}).finally(() => {
				setTimeout(() => {
					this.mergeCell(this.byId("table"), 2);
				}, 300);
			});


			// var oModel = new JSONModel();

			// var oDateFormat = DateFormat.getDateInstance({source: {pattern: "timestamp"}, pattern: "dd/MM/yyyy"});

			// jQuery.ajax(sap.ui.require.toUrl("com/bosch/sbs/gng8hc/ui/mockdata/products.json"), {
			// 	dataType: "json",
			// 	success: function(oData) {
			// 		var aTemp1 = [];
			// 		var aTemp2 = [];
			// 		var aSuppliersData = [];
			// 		var aCategoryData = [];
			// 		for (var i = 0; i < oData.ProductCollection.length; i++) {
			// 			var oProduct = oData.ProductCollection[i];
			// 			if (oProduct.SupplierName && aTemp1.indexOf(oProduct.SupplierName) < 0) {
			// 				aTemp1.push(oProduct.SupplierName);
			// 				aSuppliersData.push({Name: oProduct.SupplierName});
			// 			}
			// 			if (oProduct.Category && aTemp2.indexOf(oProduct.Category) < 0) {
			// 				aTemp2.push(oProduct.Category);
			// 				aCategoryData.push({Name: oProduct.Category});
			// 			}
			// 			oProduct.DeliveryDate = (new Date()).getTime() - (i % 10 * 4 * 24 * 60 * 60 * 1000);
			// 			oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
			// 			oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
			// 			oProduct.Available = oProduct.Status == "Available" ? true : false;
			// 		}

			// 		oData.Suppliers = aSuppliersData;
			// 		oData.Categories = aCategoryData;

			// 		oModel.setData(oData);
			// 	},
			// 	error: function() {
			// 		Log.error("failed to load json");
			// 	}
			// });

			// return oModel;
		},

		updateMultipleSelection: function(oEvent) {
			var oMultiInput = oEvent.getSource(),
				sTokensPath = oMultiInput.getBinding("tokens").getContext().getPath() + "/" + oMultiInput.getBindingPath("tokens"),
				aRemovedTokensKeys = oEvent.getParameter("removedTokens").map(function(oToken) {
					return oToken.getKey();
				}),
				aCurrentTokensData = oMultiInput.getTokens().map(function(oToken) {
					return {"Key" : oToken.getKey(), "Name" : oToken.getText()};
				});

			aCurrentTokensData = aCurrentTokensData.filter(function(oToken){
				return aRemovedTokensKeys.indexOf(oToken.Key) === -1;
			});

			oMultiInput.getModel().setProperty(sTokensPath, aCurrentTokensData);
		},

		formatAvailableToObjectState : function(bAvailable) {
			return bAvailable ? "Success" : "Error";
		},

		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},

		handleDetailsPress : function(oEvent) {
			MessageToast.show("Details for product with id " + this.getView().getModel().getProperty("ProductId", oEvent.getSource().getBindingContext()));
		},

		onPaste: function(oEvent) {
			var aData = oEvent.getParameter("data");
			MessageToast.show("Pasted Data: " + aData);
		},

		buttonPress : function(oEvent) {
			var oView = this.getView(),
				oTable = oView.byId("table"),
				sColumnCount = oView.byId("inputColumn").getValue() || 0,
				sRowCount = oView.byId("inputRow").getValue() || 0,
				sBottomRowCount = oView.byId("inputButtomRow").getValue() || 0,
				iColumnCount = parseInt(sColumnCount),
				iRowCount = parseInt(sRowCount),
				iBottomRowCount = parseInt(sBottomRowCount),
				iTotalColumnCount = oTable.getColumns().length,
				iTotalRowCount = oTable.getRows().length;

			// Fixed column count exceeds the total column count
			if (iColumnCount > iTotalColumnCount) {
				iColumnCount = iTotalColumnCount;
				oView.byId("inputColumn").setValue(iTotalColumnCount);
				MessageToast.show("Fixed column count exceeds the total column count. Value in column count input got updated.");
			}

			// Sum of fixed row count and bottom row count exceeds the total row count
			if (iRowCount + iBottomRowCount > iTotalRowCount) {

				if ((iRowCount < iTotalRowCount) && (iBottomRowCount < iTotalRowCount)) {
					// both row count and bottom count smaller than total row count
					iBottomRowCount = 1;
				} else if ((iRowCount > iTotalRowCount) && (iBottomRowCount < iTotalRowCount)) {
					// row count exceeds total row count
					iRowCount = iTotalRowCount - iBottomRowCount - 1;
				} else if ((iRowCount < iTotalRowCount) && (iBottomRowCount > iTotalRowCount)) {
					// bottom row count exceeds total row count
					iBottomRowCount = iTotalRowCount - iRowCount - 1;
				} else {
					// both row count and bottom count exceed total row count
					iRowCount = 1;
					iBottomRowCount = 1;
				}

				// update inputs
				oView.byId("inputRow").setValue(iRowCount);
				oView.byId("inputButtomRow").setValue(iBottomRowCount);
				MessageToast.show("Sum of fixed row count and buttom row count exceeds the total row count. Input values got updated.");
			}

			oTable.setFixedColumnCount(iColumnCount);
			oTable.setFixedRowCount(iRowCount);
			oTable.setFixedBottomRowCount(iBottomRowCount);
		},

		onNavIndicatorsToggle: function(oEvent) {
			var oTable = this.byId("table");
			var oToggleButton = oEvent.getSource();

			if (oToggleButton.getPressed()) {
				oTable.setRowSettingsTemplate(new RowSettings({
					navigated: "{NavigatedState}"
				}));
			} else {
				oTable.setRowSettingsTemplate(null);
			}
		},

		handleActionPress : function(oEvent) {
			var oRow = oEvent.getParameter("row");
			var oItem = oEvent.getParameter("item");
			MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressed for product with id " +
				this.getView().getModel().getProperty("ProductId", oRow.getBindingContext()));
		},

		onBehaviourModeChange : function(oEvent) {
			this.switchState(oEvent.getParameter("selectedItem").getKey());
		},

		switchState : function(sKey) {
			var oTable = this.byId("table");
			var iCount = 0;
			var oTemplate = oTable.getRowActionTemplate();
			if (oTemplate) {
				oTemplate.destroy();
				oTemplate = null;
			}

			for (var i = 0; i < this.modes.length; i++) {
				if (sKey == this.modes[i].key) {
					var aRes = this.modes[i].handler();
					iCount = aRes[0];
					oTemplate = aRes[1];
					break;
				}
			}

			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(iCount);
		},

		onSVATPress: function (oEvent) {
			let table = this.byId("table");
			var indices = table.getSelectedIndices();
			var length = indices.length;
			var err = "do something";
			var type = "hint";
			
			if (length < 1) {
				err = "No item is selected!";
				type = "error";
			} 
			this.handleDialogPress(err, type);
			
		},

		handleDialogPress: function (errMessage, type) {
			var state = ValueState.Error;
			if (type == "hint") {
				state = ValueState.Success
			}
			const dialog = new Dialog({
				type: DialogType.Message,
				title: type,
				state: state,
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

		onbSettingDialogPress: function (oEvent) {
			if (!this.bSettingDialog) {
				Fragment.load({
					id: "bSettingFragment",
					name: "com.bosch.sbs.gng8hc.ui.fragment.TableSetting",
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

		freezeColumns: function (oEvent) {
			let freezetable = this.getView().byId("table");
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
				//this.getModel("store").setProperty("/BillingPage_tableFreezeCount", iColumnCount);
				freezetable.setFixedColumnCount(iColumnCount);
			} else {
				this.handleDialogPress(freezeerr, "error");
			}
		},

		setVariantConfig: function (variant) {

			console.log("view.co..",this.getView().getModel("store"));
			//1.table column layout
			this.setBColumns(variant.columns);
			//this._billingTable.setFixedColumnCount(variant.freezeColumns);
			//2. filterbar layout
			this._setFilterBarLayout(variant.columns)
			//3. set variant title name
			// if (variant.name !== undefined) {
			// 	this.getModel("store").setProperty("/selectedVariantSetting", variant.name);
			// }
			if (variant.name !== undefined) {
				this.getModel("store").setProperty("/selectedVariantSetting", variant.name);
			}
		},

		_setFilterBarLayout: function (bColumns) {
			this.byId("filterbar").destroyFilterGroupItems();
			bColumns.forEach(element => {
				let columnName = element.column == undefined ? element.name : element.column;
				//let exceptColumns = ["ProductName", "ProductId"];
				//if (!exceptColumns.includes(columnName)) {
				let newFilterItem = new sap.ui.comp.filterbar.FilterGroupItem(undefined, {
					visibleInFilterBar: element.filterVisible,
					groupName: "Standard",
					groupTitle: "All filters",
					name: columnName,
					label: columnName,
					control: new sap.m.Input(`filterItem_` + columnName + new Date().getTime(), {})
				});
				this.byId("filterbar").addFilterGroupItem(newFilterItem);
				// }
			});
			console.log(bColumns);
		},

		onHandleVariant: function (oEvent) {
			let oButton = oEvent.getSource();
			this._generatePopOver();
			this.newPopover.openBy(oButton);
		},

		_generatePopOver: function () {
			if (!this.newPopover) {
				//console.log("bucunzai")
				let variantList = this.getVariants();
				console.log(variantList, "valist");
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
							//console.log(selectedItem)
							//更改选择的selectedVariantSetting的字和SelectList中选中值
							this.getModel("store").setProperty("/selectedVariantSetting", selectedItem.getText());
							e.getSource().setSelectedKey(selectedItem.getKey());

							//e拿到id,根据id拿到variantSetting.json中的SearchableColumns
							//应用到表格上, store里面的bColumn覆盖一下
							variantList.forEach(element => {
								if (element.id == selectedItem.getKey()) {
									//console.log("bcolumns",element.searchableColumns)
									if (element.columns !== [] || undefined || null) {
										
										this.getModel("store").setProperty("/bColumns", element.columns);
										this.setVariantConfig(element);
										console.log("11111", element.columns);
										//this.byId("table").setFixedColumnCount(element.freezeColumns)
										//console.log("set successfully", this.getBColumns())
										//调用接口,刷新一下数据,ux+
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
					/* endButton: new Button({
						type: ButtonType.Emphasized,
						text: "Manage",
						press: function () {
							this.newPopover.close();
							this._Variant_manageView();
						}.bind(this)
					}) */

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
				let allFiltersColumns = this.byId("filterbar").getAllFilterItems();
				let visibleItem = allFiltersColumns.filter(item => item.getProperty('visibleInFilterBar') == true);
				let bcolumns = this.getModel("store").getProperty("/bColumns");
				console.log('lllll', visibleItem);
				console.log('lllls', this.getModel("store").getProperty("/bColumns"));
				for (let obj of allFiltersColumns) {
					for (let item of bcolumns) {
						if (item.name == obj.getProperty('name')) {
							item.filterVisible = obj.getProperty('visibleInFilterBar');
						}
					}
					//this.setBColumnVisible(obj.getProperty('name'), obj.getProperty('visibleInFilterBar'));
				}
				this.getModel("store").setProperty("/bColumns", bcolumns);
				console.log('bcolumnsset', bcolumns);
				let freezeCount = this.getModel("store").getProperty("/BillingPage_tableFreezeCount");
				let saveDto = {
					"name": oModel.newData.ViewName,
					"default": oModel.newData.SetDefault,
					"favourite": false,
					"freezeColumns": freezeCount,
					//"createBy": "",//get userInfo by backend
					"columns": bcolumns
				};
				//invoke save api

				this.addVariant(saveDto).then((result) => {
					console.log(saveDto, "saveDto", result, "add variant")
					MessageToast.show("save successfully");
					this.getVariantList().then((result) => {
						this.setVariants(result);
						//重新生成variant控件
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
					name: "com.bosch.sbs.gng8hc.ui.fragment.VariantManagement",
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
			//update dto and invoke api 
			let arrDto = this.getVariants();
			let calls = [];
			arrDto.forEach(element => {
				//Promise.all
				let call = this.updateVariant(element.id, {
					"default": element.default,
					"favourite": element.favourite,
					"name": element.name,
					"freezeColumns": element.freezeColumns// 如果不加这个属性,后端会重置为0?
				});
				calls.push(call)
			});
			Promise.all(calls).then((values) => {
				MessageToast.show(`update variant sucessfully!`)
				this.getVariantList().then((result) => {
					this.setVariants(result);
					//重新生成variant控件
					this.newPopover.destroy();
					this.newPopover = undefined;
					this._generatePopOver();
				});
			});
		},

		onDelete_variantMngt: function (e) {
			let row = e.getSource().getParent();
			let rowId = row.getCells()[0].getText()
			this.deleteVariant(rowId).then(() => {
				MessageToast.show(`delete variant successfully!`)
				this.getVariantList().then((result) => {
					this.setVariants(result);

					//重新生成variant控件
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
				//如果不是第一次加载(即通过分页event触发), 调用后端接口拿数据
				//default: 是通过trigger分页事件进来的
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
						// press: this.Click.bind(this)
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
						// press: this.ClickNumber.bind(this)
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

			/**
			 * 根据分页,截取data中需要展示的数据
			 * 如果后端处理分页的话,只需要直接把数据set进来(逻辑可以去掉),但是后端有可能要增添排序逻辑(根据需求,是否有单字段排序)
			 */
			filterTable: function () {
				var dto = {
					pageSize: that.getModel("store").getProperty("/pageSize"),
					currentPage: this.page,
				};
				console.log(dto);
				that.fetchTableData(dto).then((result) => {
					that.getView().setModel(new JSONModel({ "tableList": result.tableList }));
					that.getView().getModel("store").setProperty("/tableListTotalCount", result.totalCount);
					that.getModel("store").setProperty("/tableList", result.tableList);
					that._reportData = result.tableList;
	
				}).catch((err) => {
					console.log(err)
				}).finally(() => {
				});

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
				// oHBox1.addItem(oComboBoxCount);
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
				//oContentHolder.addContent(oVBox1);
				oContentHolder.setFooter(oVBox1);
			}

			this.generatePaginator(tableData);
			// oTable.addDelegate({
			// 	onAfterRendering: function () {
			// 		this.generatePaginator();
			// 	}.bind(this)
			// });
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
			var oTablex = this.getView().byId("table");
			let totalcount = this.getView().getModel("store").getProperty("/tableListTotalCount");

			if (tableData === undefined)
				return;

			//var countTable = tableData.length;// 从store里面拿出来,全局变量,total
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
			//step: 可以调节生成页码的个数 ...2*step+1个...
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

		mergeCell: function (table, colIndex) {
			var sId = table.sId;
			console.log(sId);
			var $table = $("#"+sId+"-table");
			$table.data('col-content', ''); // 存放单元格内容;  Store cell content
        	$table.data('col-rowspan', 1);  // 存放计算的rowspan值  默认为1; Store rowspan default 1
        	$table.data('col-td', $());     // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象; Store the first td found that is different from the previous line
        	$table.data('trNum', this.getModel("store").getProperty("/pageSize") + 1); // 要处理表格的总行数, 用于最后一行做特殊处理时进行判断之用; The total number of rows to be processed. This is used to determine when special processing is performed on the last row  

        	// 我们对每一行数据进行"扫面"处理 关键是定位col-td, 和其对应的rowspan
			// We scan each row of data and the key is to locate the COL-TD and its rowSPAN  
			$('.test-table tbody tr').each(function (index) {
				// td:eq中的colIndex即列索引
				var $td = $('td:eq(' + colIndex + ')', this);

				// 取出单元格的当前内容
				// Retrieves the current contents of the cell
				var currentContent = $td[0].innerText;

				// 第一次时走此分支
				// The first time you go this branch
				if ($table.data('col-content') == '') {

					$table.data('col-content', currentContent);
					$table.data('col-td', $td);

				} else {
					// 上一行与当前行内容相同
					// The previous line has the same content as the current line
					if ($table.data('col-content') == currentContent) {
						// 上一行与当前行内容相同则col-rowspan累加, 保存新值
						// If the previous row has the same content as the current row, col-rowSPAN accumulates to save the new value  
						var rowspan = $table.data('col-rowspan') + 1;
						$table.data('col-rowspan', rowspan);
						$td.hide();

						// 最后一行的情况比较特殊一点
						// The last row is a little bit more special
						// 比如最后2行 td中的内容是一样的, 那么到最后一行就应该把此时的col-td里保存的td设置rowspan
						// For example, if the contents of the last two td lines are the same, then the td saved in the col-TD should be set to rowSPAN in the last line 
						if (++index == $table.data('trNum'))
							$table.data('col-td').attr('rowspan', $table.data('col-rowspan'));

					} else { // 上一行与当前行内容不同
						// col-rowspan默认为1, 如果统计出的col-rowspan没有变化, 不处理
						// The default col-Rowspan value is 1. If the collected col-Rowspan value does not change, the value is not processed  
						if ($table.data('col-rowspan') != 1) {
							$table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
						}
						// 保存第一次出现不同内容的td, 和其内容, 重置col-rowspan
						// Save the TD with the first occurrence of different content, and its contents, reset col-Rowspan
						$table.data('col-td', $td);
						$table.data('col-content', $td[0].innerText);
						$table.data('col-rowspan', 1);
					}
				}
			});
		}

	});

});