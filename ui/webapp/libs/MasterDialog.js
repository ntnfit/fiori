// @ts-ignore
sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/ButtonType',
	'sap/m/FlexBox',
	'sap/m/VBox',
	'sap/m/Label',
	'sap/m/Input',
	'sap/m/InputType',
	'sap/m/Switch',
	'sap/m/SwitchType',
	'sap/m/DateTimePicker',
	"sap/ui/core/CalendarType",
	"sap/ui/core/mvc/Controller",
	"sap/m/Select",
	"sap/ui/core/Item"
], /**
 * @param {typeof sap.m.Button} Button 
 * @param {typeof sap.m.Dialog} Dialog 
 * @param {typeof sap.m.Text} Text 
 * @param {typeof sap.m.ButtonType} ButtonType 
 * @param {typeof sap.m.FlexBox} FlexBox 
 * @param {typeof sap.m.VBox} VBox 
 * @param {typeof sap.m.Label} Label 
 * @param {typeof sap.m.Input} Input 
 * @param {typeof sap.m.InputType} InputType 
 * @param {typeof sap.m.Switch} Switch 
 * @param {typeof sap.m.SwitchType} SwitchType 
 * @param {typeof sap.m.DateTimePicker} DateTimePicker 
 * @param {typeof sap.ui.core.CalendarType} CalendarType 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.m.Select} Select 
 * @param {typeof sap.ui.core.Item} Item 
 */
function (
	Button,
	Dialog,
	Text,
	ButtonType,
	FlexBox,
	VBox,
	Label,
	Input,
	InputType,
	Switch,
	SwitchType,
	DateTimePicker,
	CalendarType,
	Controller,
	Select,
	Item
) {
	"use strict";

	return {
		/**
		 * The helper function to generate dialog by template data (two way bind by model)
		 * @param {string} title - dialog title
		 * @param {string} type - 'Message' or 'Standard'
		 * @param {object} oModel - the JSONModel containe the template data
		 * @param {string} modelName - JSONModel name
		 * @param {string} sPath - path to the template data in model
		 * @param {object} labelField - the map between fields name and its' label
		 * @param {string[]} ignoreField - field does not need
		 * @param {function} beginButtonEvent - begin button callback
		 * @param {function} endButtonEvent - end button callback
		 * @param {number[]} gapIndex - add gap below the row of this index
		 * @returns {sap.m.Dialog} - sap.m.dialog
		 */
		editDialog: function (title, type, oModel, modelName, sPath, labelField, ignoreField, beginButtonEvent, endButtonEvent, gapIndex) {
			title = title || "Dialog";
			labelField = labelField || {};
			ignoreField = ignoreField || [];
			const templateData = oModel.getProperty(sPath);
			const content = this._generateContent(templateData, modelName, sPath, labelField, ignoreField, oModel, gapIndex);
			const dialog = new Dialog({
				title: title,
				type: type,
				contentWidth: "400px",
				content: content,
				beginButton: new Button("beginButton",{
					type: ButtonType.Emphasized,
					text: 'Save',
					press: beginButtonEvent
				}),
				endButton: new Button("endButton",{
					text: 'Cancel',
					press: endButtonEvent
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(`${title.split(" ")[0]}-dialog`);
			return dialog;
		},

		/***
		 * if your model have 2 Array----->2 Select, u must pay attention to the parameter to make the amount keep same,  2 "selectorKVList", 2 "changeEvent"
		 */
		editDialogWithSelect: function (title, type, oModel, modelName, sPath, labelField, ignoreField, beginButtonEvent, endButtonEvent,selectorKVList, gapIndex,...changeEvent) {
			title = title || "Dialog";
			labelField = labelField || {};
			ignoreField = ignoreField || [];
			const templateData = oModel.getProperty(sPath);
			const content = this._generateContentWithSelect(templateData, modelName, sPath, labelField, ignoreField, oModel, gapIndex,changeEvent,selectorKVList);
			const dialog = new Dialog({
				title: title,
				type: type,
				contentWidth: "400px",
				content: content,
				beginButton: new Button("beginButton",{
					type: ButtonType.Emphasized,
					text: 'Save',
					press: beginButtonEvent
				}),
				endButton: new Button("endButton",{
					text: 'Cancel',
					press: endButtonEvent
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(`${title.split(" ")[0]}-dialog`);
			return dialog;
		},

		/**
		 * 
		 * @param {string} title - title
		 * @param {string} message - message
		 * @param {function} endButtonEvent - end button callback
		 * @returns {sap.m.Dialog} - sap.m.dialog
		 */
		infoDialog: function (title, message, endButtonEvent) {
			title = title || "Message";
			message = message || "";
			const dialog = new Dialog({
				title: title,
				type: "Message",
				content: new Text({
					text: message
				}),
				endButton: new Button("endButton",{
					text: 'Cancel',
					press: endButtonEvent
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(`${title.split(" ")[0]}-dialog`);
			return dialog;
		},

		deleteDialog: function (beginButtonEvent) {
            let oDialog = new Dialog({
                title: 'Warning',
                type: 'Message',
                state: 'Warning',
                content: new Text({
                    text: 'Are you sure to excute the deletion? '
                }),
                beginButton: new Button("beginButton",{
                    type: ButtonType.Emphasized,
                    text: 'Yes',
                    press: beginButtonEvent
                }),
                endButton: new Button("endButton",{
                    type: ButtonType.Emphasized,
                    text: 'No',
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });
            return oDialog;
        },

		/**
		 * 
		 * @param {object} templateData - template data
		 * @param {string} modelName - JSONModel name
		 * @param {string} sPath - path to the template data in model
		 * @param {object} labelField - the map between fields name and its' label
		 * @param {string[]} ignoreField - field does not need
		 * @param {object} oModel - the JSONModel containe the template data
		 * @param {number[]} gapIndex - add gap below the row of this index
		 * @returns {object[]} - array of component
		 */
		_generateContent: function (templateData, modelName, sPath, labelField, ignoreField, oModel, gapIndex) {
			const content = [];
			let temp = [];
			const data = JSON.parse(JSON.stringify(templateData));
			let index = 0;
			let blockIndex = 0;
			for (let key in data) {
				if (ignoreField.indexOf(key) === -1) {
					const value = data[key];
					const component = this._generateRow(key, value, index, modelName, sPath, labelField, oModel);
					temp.push(component);
					if (gapIndex.indexOf(index) !== -1) {
						const flexBox = new VBox(`innerBlock_${blockIndex}`, {
							justifyContent: "SpaceBetween",
							items: temp
						});
						++blockIndex;
						temp = [];
						flexBox.addStyleClass('sapUiMediumMarginBottom');
						content.push(flexBox);
					}
					++index;
				} else {
					continue;
				}
			}
			if (temp.length !== 0) {
				const flexBox = new VBox(`innerBlock_${blockIndex}`, {
					justifyContent: "SpaceBetween",
					items: temp
				});
				temp = [];
				flexBox.addStyleClass('sapUiSmallMarginBottom');
				content.push(flexBox);
			}
			return content;
		},

		/**
		 * 
		 * @param {any} key - key
		 * @param {any} value - value
		 * @param {number} index - index
		 * @param {string} modelName - JSONModel name
		 * @param {string} sPath - path to the template data in model
		 * @param {object} labelField - the map between fields name and its' label
		 * @param {object} oModel - the JSONModel containe the template data
		 * @returns {sap.m.FlexBox} - sap.m.FlexBox
		 */
		_generateRow: function (key, value, index, modelName, sPath, labelField, oModel) {
			const flexBox = new FlexBox(`innerBox_${index}`, {
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					this._generateLabel(key, labelField),
					this._generateDataControl(key, value, modelName, sPath, oModel)
				]
			});
			return flexBox;
		},

		/**
		 * 
		 * @param {*} key - key
		 * @param {object} labelField - the map between fields name and its' label
		 * @returns {sap.m.Label} - sap.m.label
		 */
		_generateLabel: function (key, labelField) {
			let text = "";
			if (typeof labelField.key === 'undefined') {
				text = labelField[key];
			} else {
				text = key;
			}
			return new Label({
				text: text,
				labelFor: key
			});
		},

		/**
		 *  
		 * @param {any} key - key
		 * @param {any} value - value
		 * @param {string} modelName - JSONModel name
		 * @param {string} sPath - path to the template data in model
		 * @param {object} oModel - the JSONModel containe the template data
		 * @returns {sap.m.Input | sap.m.Switch} - data controller
		 */
		_generateDataControl: function (key, value, modelName, sPath, oModel) {
			let t = {};
			switch (typeof value) {
				case 'number': {
					t = new Input(key, {
						width: "200px",
						value: `{${modelName}>${sPath}/${key}}`,
						type: InputType.Number,
						change: function () {
							const data = Number(this.getValue());
							oModel.setProperty(`${sPath}/${key}`, data);
						}
					});
					break;
				}
				case 'string': {
					t = new Input(key, {
						width: "200px",
						value: `{${modelName}>${sPath}/${key}}`,
						type: InputType.Text
					});
					break;
				}
				case 'boolean': {
					t = new Switch(key, {
						state: `{${modelName}>${sPath}/${key}}`,
						type: SwitchType.AcceptReject
					});
					break;
				}
				case 'object': {
					////console.log(value.type)
					const type = value.type;
					if (type === 'date' || type === 'Date') {
						t = new DateTimePicker(key, {
							width: "200px",
							displayFormat: "yyyy-MM-dd' 'HH:mm:ss",
							valueFormat: "yyyy-MM-dd'T'HH:mm:ss",
							value: `{${modelName}>${sPath}/${key}/value}`
						});
						t.setPlaceholder("");
					} 
					break;
				}
				default: {
					break;
				}
			}
			return t;
		},


		_generateContentWithSelect: function (templateData, modelName, sPath, labelField, ignoreField, oModel, gapIndex,changeEventList,selectorKVList) {
			const content = [];
			let temp = [];
			const data = JSON.parse(JSON.stringify(templateData));
			let index = 0;
			let blockIndex = 0;
			let selectIndex = 0;
			for (let key in data) {
				if (ignoreField.indexOf(key) === -1) {
					const value = data[key];
					const component = this._generateRowWithSelect(key, value, index, modelName, sPath, labelField, oModel,changeEventList[selectIndex],selectorKVList[selectIndex]);
					temp.push(component);
					if (gapIndex.indexOf(index) !== -1) {
						const flexBox = new VBox(`innerBlock_${blockIndex}`, {
							justifyContent: "SpaceBetween",
							items: temp
						});
						++blockIndex;
						temp = [];
						flexBox.addStyleClass('sapUiMediumMarginBottom');
						content.push(flexBox);
					}
					++index;
					//if it is selector, 
					if (Array.isArray(value)) {
						++selectIndex;
					}
				} else {
					continue;
				}
			}
			if (temp.length !== 0) {
				const flexBox = new VBox(`innerBlock_${blockIndex}`, {
					justifyContent: "SpaceBetween",
					items: temp
				});
				temp = [];
				flexBox.addStyleClass('sapUiSmallMarginBottom');
				content.push(flexBox);
			}
			return content;
		},

		_generateRowWithSelect: function (key, value, index, modelName, sPath, labelField, oModel,changeEvent,selectorKV) {
			const flexBox = new FlexBox(`innerBox_${index}`, {
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					this._generateLabelWithSelect(key, labelField),
					this._generateDataControlWithSelect(key, value, modelName, sPath, oModel,changeEvent,selectorKV)
				]
			});
			return flexBox;
		},

		/**
		 * 
		 * @param {*} key - key
		 * @param {object} labelField - the map between fields name and its' label
		 * @returns {sap.m.Label} - sap.m.label
		 */
		_generateLabelWithSelect: function (key, labelField) {
			let text = "";
			if (typeof labelField.key === 'undefined') {
				text = labelField[key];
			} else {
				text = key;
			}
			return new Label({
				text: text,
				labelFor: key
			});
		},

		/**
		 *  
		 * @param {any} key - key
		 * @param {any} value - value
		 * @param {string} modelName - JSONModel name
		 * @param {string} sPath - path to the template data in model
		 * @param {object} oModel - the JSONModel containe the template data
		 * @returns {sap.m.Input | sap.m.Switch} - data controller
		 * @param {object} changeEvent -event for selector
		 * @param {object} selectorKV - key-->selector's key ; value-->selector's text
		 */
		_generateDataControlWithSelect: function (key, value, modelName, sPath, oModel,changeEvent,selectorKV) {
			let t = {};
			switch (typeof value) {
				case 'number': {
					t = new Input(key, {
						width: "200px",
						value: `{${modelName}>${sPath}/${key}}`,
						type: InputType.Number,
						change: function () {
							const data = Number(this.getValue());
							oModel.setProperty(`${sPath}/${key}`, data);
						}
					});
					break;
				}
				case 'string': {
					t = new Input(key, {
						width: "200px",
						value: `{${modelName}>${sPath}/${key}}`,
						type: InputType.Text
					});
					break;
				}
				case 'boolean': {
					t = new Switch(key, {
						state: `{${modelName}>${sPath}/${key}}`,
						type: SwitchType.AcceptReject
					});
					break;
				}
				case 'object': {
					////console.log(value.type)
					const type = value.type;
					if (type === 'date' || type === 'Date') {
						t = new DateTimePicker(key, {
							width: "200px",
							displayFormat: "yyyy-MM-dd' 'HH:mm:ss",
							valueFormat: "yyyy-MM-dd'T'HH:mm:ss",
							value: `{${modelName}>${sPath}/${key}/value}`
						});
						t.setPlaceholder("");
					} 
					if (Array.isArray(value)) {
					//else {
						////console.log(value)
						// let oTemp = {
						// 	id: "",
						// 	metal: ""
						// };

						let itemList = [];
						let bindKey = selectorKV["key"];
						let bindText = selectorKV["value"];
						value.forEach(element => {
							itemList.push(new Item({
								key : element[bindKey],
								text : element[bindText]
								// key : element.id,
								// text : element.metal
							}));
						});
							t = new Select(key,{
								//selectedKey: "{store>/selectedMetal}",
								width: "200px",
								items: itemList,
								//change: "onSelectChange",
								//template: oTemp
								change: changeEvent
							});
						// .bindItems({
						// 	path: `${modelName}>${sPath}/${key}`,
						// 	template: oTemp,
						// });
					}
					break;
				}
				default: {
					break;
				}
			}
			return t;
		}
	};
});