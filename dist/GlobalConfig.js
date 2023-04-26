"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigStore = void 0;
var ConfigStore;
(function (ConfigStore) {
    ConfigStore.serviceToken = `${process.env.CDK_DEPLOY_REGION}`;
    function init(target, { baselimeApiKey }) {
        ConfigStore.construct = target;
        ConfigStore.baselimeSecret = baselimeApiKey;
    }
    ConfigStore.init = init;
})(ConfigStore = exports.ConfigStore || (exports.ConfigStore = {}));
//# sourceMappingURL=GlobalConfig.js.map