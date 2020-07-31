const Request = artifacts.require("RequestChain");

module.exports = function(_deployer) {
  _deployer.deploy(Request);
};
