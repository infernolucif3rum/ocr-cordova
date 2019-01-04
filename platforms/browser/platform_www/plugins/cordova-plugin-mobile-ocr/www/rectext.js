cordova.define("cordova-plugin-mobile-ocr.rectext", function(require, exports, module) { /*global cordova, module*/

module.exports = {
    recText: function (sourceType, returnType, imageSource, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Textocr", "recText", [sourceType, returnType, imageSource]);
    }
};
});
