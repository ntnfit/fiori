1. All route name must be "ALL CAPITAL".
2. Never put the data in store when it only be used in one controller.
3. Don't use () => {} instead of function () {} when you need to use "this" in the function
4. Please define the JSONModel in controller level as below
```javascript
    data: () => {
        return {
            dataA: someDataA,
            dataB: someDataB,
        }
    },

    onInit: function () {
        this.setModel(new sap.ui.model.json.JSONModel(this.data()), "SomedataModel")
    },
```
5. Never directly edit the css file. Please change the style by editing .scss file in sass folder.