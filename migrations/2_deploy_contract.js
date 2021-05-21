// 2_deploy_contracts.js
var Coinjob = artifacts.require("./Coinjob.sol");

module.exports = function (deployer) {
  deployer.deploy(Coinjob);
};