const Coinjob = artifacts.require("./contracts/CoinJob.sol");

contract('Coinjob', function (accounts) {
    let coinjobInstance;

    it("컨트랙의 소유자 초기화 테스팅", function () {
        return Coinjob.deployed().then(function (instance) {
            coinjobInstance = instance;
            return coinjobInstance.owner.call();
        }).then(function (owner) {
            assert.equal(owner.toUpperCase(), accounts[0].toUpperCase(), "owner가 가나슈 첫 번째 계정과 일치하지 않습니다.");
        });
    });
});