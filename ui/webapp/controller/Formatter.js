sap.ui.define([], function () {
    "use strict";


    /**
     * 
     * @param {String} fmt 最后output的样式 eg:yyyy年MM月dd日hh小时mm分ss秒
     */
    Date.prototype.format =  function(fmt){
        var o = {
          "M+" : this.getMonth()+1,                 //月份
          "d+" : this.getDate(),                    //日
          "h+" : this.getHours(),                   //小时
          "m+" : this.getMinutes(),                 //分
          "s+" : this.getSeconds(),                 //秒
          "q+" : Math.floor((this.getMonth()+3)/3), //季度
          "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)){
          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }  
        for(var k in o){
          if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(
              RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
          }       
        }
        return fmt;
      };



    return {
        removePunctuation: function (text) {
            let regex = /[^\u4e00-\u9fa5\w]/g;
            //var str = "我12454rdfdfdl.说的,>*路径;#?9";
            text = text.replace(regex, "")
            return text;
        },

        /**
         * 判断array中的元素是否都相等
         * @param {Array} array 
         */
        isAllEqual: function (array) {
            if (array.length > 0) {
                return !array.some(function (value, index, array) {
                    return value !== array[0];
                });
            } else {
                return true;
            }
        },

        Number2UpperString: function(n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){
                return "数据非法";  //判断数据是否大于0
            }        
            var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
            n += "00";          
            var indexpoint = n.indexOf('.');  // 如果是小数，截取小数点前面的位数       
            if (indexpoint >= 0){
        
                n = n.substring(0, indexpoint) + n.substr(indexpoint+1, 2);   // 若为小数，截取需要使用的unit单位
            }      
            unit = unit.substr(unit.length - n.length);  // 若为整数，截取需要使用的unit单位
            for (var i=0; i < n.length; i++){
                str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);  //遍历转化为大写的数字
            }
            return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"); // 替换掉数字里面的零字符，得到结果
        },

        format2TextByExpressState: function(state) {
            if (state=="1") {
                return "Delivered"
            }
            else {
                return "In Process"
            }
        },
        
        format2IconByExpressState: function(state) {
            if (state=="已签收") {
                return "sap-icon://complete"
            }
            else {
                return "sap-icon://BusinessSuiteInAppSymbols/icon-truck-driver"
            }
        },
        
        format2ObjStateByExpressState: function(state) {
            if (state=="已签收") {
                return "Success"
            }
            else {
                return "Information"
            }
        }
    };
});