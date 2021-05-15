 pragma solidity >=0.4.22 <0.6.0;
contract Coinjob {
    
    struct Job{
        address payable writer;
        string title;
        string content;
        uint deadline;
        uint reward;
        uint accepted;
        address payable accepter;
        uint finish;
    }
    
    Job[] public job;
    
    uint public postContract = 0.05 ether;
    
    function publishJob(string memory _title, string memory _content, uint _deadline, ){
        uint memory deadline = block.timestamp + _deadline; 
        Job memory newJob = Job(msg.sender, _title, _content, deadline, msg.value, 0, '', finish=0);
        job.push(newJob);
    }
    
    function alljob() public returns (Job[] memory){
        return job;
    }
    
    function getjob(uint _number) public returns(address writer, string memory title, string memory content, uint deadline, uint reward){
        writer = job[_number].writer;
        title = job[_number].title;
        content = job[_number].content;
        deadline = job[_number].deadline;
        reward = job[_number].reward;
    }
    
    function acceptJob(){
        
    }
    
    function 
    
    
    function endJob(){
        
    }
