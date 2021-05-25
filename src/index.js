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

    init: function () {
        console.log("Init app")
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
        App.render();
    },

    render: function () {
        console.log("Function render")

        App._loading();
        // Load account data
        ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            if (accounts) {
                App.account = accounts[0];
                $("#accountAddress").html("Your Account: " + App.account);
            }
            App._loaded();
            $("#pageId").html(pagenum);
            renderAllJob(pagenum,viewperpage);
        });

    },

    allJob: function (page = -1, perPage = 10) {
        console.log("Function allJob")
        let CoinjobInstance;

        App._loading();

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
        }).catch(function (error) {
            console.error(error);
            throw error;
        });
    },

    publishJob: function (title, contet, dontdisturb, deadline) {
        console.log("Function publishJob")
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.publishJob(title, contet, dontdisturb, deadline,
                {
                    from: App.account,
                    value: web3.utils.toWei("0.5", "ether")
                }
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

    acceptJob: function (_number, _contact) {
        console.log("Function acceptJob");
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.acceptJob(_number,{
                from: App.account});
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

    workDone: function (_number) {

        console.log("Function workDone");
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.workDone(_number,{
                from: App.account});
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

    finishJob: function (_number) {

        console.log("Function finishJob");
        let CoinjobInstance;

        App._loading();

        return App.contracts.Coinjob.deployed().then(async function (instance) {
            CoinjobInstance = instance;
            return CoinjobInstance.finishJob(_number,{
                from: App.account});
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