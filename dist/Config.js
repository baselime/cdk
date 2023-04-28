"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigStore = void 0;
var ConfigStore;
(function (ConfigStore) {
    ConfigStore.serviceToken = `arn:aws:lambda:${process.env.CDK_DEPLOY_REGION}:374211872663:function:baselime-orl-cloudformation`;
    function init(target, { apiKey }) {
        ConfigStore.construct = target;
        ConfigStore.baselimeSecret = apiKey;
    }
    ConfigStore.init = init;
})(ConfigStore = exports.ConfigStore || (exports.ConfigStore = {}));
//# sourceMappingURL=Config.js.map