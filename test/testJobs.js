const Coinjob = artifacts.require("./contracts/CoinJob.sol");
const web = require("web3");
https://github.com/truffle-box/pet-shop-box/blob/master/src/js/app.js
contract('Coinjob', function (accounts) {
    let coinjobInstance;

    const title = "Hello";
    const contet = "I want you.";
    const dontdisturb = web3.utils.toWei("1", "ether");
    const deadline = Date.now();

    it("Job publish minimum cost 테스트 (0.5 ether 이상을 보상으로 걸어야함)", function () { // 무슨 minimum cost 테스트 할건지 : it
        return Coinjob.deployed().then(function (instance) { // 배포가 됐다면
            coinjobInstance = instance;

            return coinjobInstance.publishJob(
                title, contet, dontdisturb, deadline,
                {
                    from: accounts[0],
                    value: web3.utils.toWei("0.1")

                });
        }).then(function () {
            assert.fail("Job rewad는 0.5 이상이어야 합니다.");
        }).catch(function (e) {
            assert.equal(e, "AssertionError: Job rewad는 0.5 이상이어야 합니다.")
        });
    });

    const publishCount = Math.ceil(Math.random() * 100 % 15);
    const perPage = 5;

    it("Job publish 테스트", function () { // 무슨 테스트 할건지 : it

        return Coinjob.deployed().then(function (instance) { // 배포가 됐다면
            coinjobInstance = instance;
            for (let i = 1; i < publishCount; i++) {
                const title = "Hello";
                const contet = "I want you.";
                const dontdisturb = web3.utils.toWei("1", "ether");
                const deadline = Date.now();
                coinjobInstance.publishJob(title, contet, dontdisturb, deadline,
                    {
                        from: accounts[0],
                        value: web3.utils.toWei("0.5", "ether")

                    });
            }
            return coinjobInstance.allJob();
        }).then(function (jobList) {
            assert.equal(jobList.length, publishCount);
        });
    });

    it("Job pagination 테스트", function () { // 무슨 테스트 할건지 : it
        return Coinjob.deployed().then(function (instance) { // 배포가 됐다면
            coinjobInstance = instance;
            return coinjobInstance.getPaginatedSquares(1, perPage);
        }).then(function (jobList) {
            assert.equal(jobList.length, perPage);
            const lastPage = Math.floor(publishCount / perPage) + 1;
            return coinjobInstance.getPaginatedSquares(lastPage, perPage);
        }).then(function (jobList) {
            assert.equal(jobList.length, publishCount % perPage);
        });
    });
});