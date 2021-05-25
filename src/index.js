(function () {
    'use strict';
}());

import Web3 from "web3";
import contractJson from "../build/contracts/Coinjob.json";
import $ from "jquery";
import contract from "@truffle/contract";

window.jQuery = $;
window.$ = $;

const App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    renderAllJob: null,
    perPage: 10,

    init: function (renderCallback, perPage) {
        console.log("Init app")
        App.renderAllJob = renderCallback;
        App.perPage = perPage;
        return App.initWeb3();
    },

    initWeb3: function () {
        console.log("Function initWeb3")
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function () {
        console.log("Function initContract")
        App.contracts.Coinjob = contract(contractJson);
        App.contracts.Coinjob.setProvider(App.web3Provider);
        App.login();
        App.refreshJob();
    },

    refreshJob: function () {
        console.log("Function allJob")

        // Load contract data
        return App.contracts.Coinjob.deployed().then(function (instance) {
            const event = instance.jobRefresh(function (error, event) {
                console.log("Event: Refresh Job", event);
                if (error) {
                    App.noticeError(err);
                }
                App.allJob(1, 10).then((jobList) => {
                    App.renderAllJob(1, App.perPage);
                    App._loaded();
                });
            });
        }).catch(App.noticeError);
    },

    noticeError: function (err) {
        console.error(err);
        alert(err);
    },

    login: function () {
        console.log("Function login")

        App._loading();
        // Load account data
        ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            if (accounts) {
                App.account = accounts[0];
                $("#accountAddress").html("Your Account: " + App.account);
            }
            App._loaded();
            $("#pageId").html(pagenum);
            renderAllJob(pagenum, viewperpage);
        });
    },

    allJob: function (page = -1, perPage = null) {
        console.log("Function allJob")
        let CoinjobInstance;

        App._loading();

        // 앱에 설정된 페이지가 있다면 그 수를 따름.
        if (perPage == null) {
            perPage = App.perPage;
        }

        // Load contract data
        return App.contracts.Coinjob.deployed().then(function (instance) {
            CoinjobInstance = instance;
            if (page !== -1 || !perPage) {
                return CoinjobInstance.getPaginatedSquares(page, perPage);
            }
            console.warn(`모든 Job을 가져옵니다.`);
            console.warn(`페이지네이션을 위해서는 page 번호와, page 당 글 개수를 지정해주세요.`);
            return CoinjobInstance.allJob();
        }).then(function (jobList) {
            console.log("Job list", jobList);
            App._loaded();
            return jobList;
        }).catch(App.noticeError);
    },

    publishJob: function (title, contet, dontdisturb, deadline, reward = "0.5") {
        console.log("Function publishJob")
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.publishJob(title, contet, dontdisturb, deadline,
                {
                    from: App.account,
                    value: web3.utils.toWei(String(reward), "ether")
                }
            );
        }).then(function (job) {
            console.log("Job", job);
            App._loaded();
            renderAllJob(pagenum, viewperpage);
            return job;
        }).catch(App.noticeError);
    },

    acceptJob: function (number, contact, fee) {
        console.log("Function acceptJob")
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.acceptJob(number, contact,
                {
                    from: App.account,
                    value: web3.utils.toWei(String(fee), "ether")
                }
            );
        }).then(function (job) {
            console.log("Job", job);
            App._loaded();
            return job;
        }).catch(App.noticeError);
    },

    workDone: function (number) {
        console.log("Function workDone")
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.workDone(number);
        }).catch(App.noticeError);
    },

    finishJob: function (number) {
        console.log("Function finishJob")
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.finishJob(number, contact);
        }).catch(App.noticeError);
    },
  
    giveupJob: function (_number) {

        console.log("Function giveupJob");
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.giveupJob(_number,{
                from: App.account}
            );
        }).then(function (job) {
            console.log("Job", job);
            App._loaded();
            renderAllJob(pagenum,viewperpage);
            return job;
        }).catch(function (error) {
            console.error(error);
            throw error;
        });
    },


    /**
     * 프론트는 위의 함수들만 사용하세요.
     */
    _loading: function () {
        let loader = $("#loader");
        let content = $("#content");
        loader.show();
        content.hide();;
    },

    _loaded: function () {
        let loader = $("#loader");
        let content = $("#content");
        loader.hide();
        content.show();
    },
};

export default App;