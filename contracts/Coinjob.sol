pragma solidity >=0.8.0 <0.9.0;
pragma experimental ABIEncoderV2;
contract Coinjob {
    
    enum status { open, finish, workerDone}
    // open = 구인중 
    // finish = 일의 종료 
    // workerDone = 수락자가 일을 끝내고 대기중 
    // bossDone = 일의 제안자가 일의 취소를 원함 (일을 수락한 자가 있을 때)
    
    // workerDone 과 bossDone은 Job의 accepted가 true 일때만 상태로서 있을 수 있다.
    
    struct Job{
        uint id;
        address writer;
        string title;
        string content;
        uint deadline;
        uint reward;
        uint dontdisturb;
        bool accepted;
        address accepter;
        string contact; // 수락자와 컨택할수 있는 무언가 (오픈카톡?)
        status stat;
    }
    
    Job[] public job;
    
    
    event jobRefresh();
    
    
    //
    uint public postContract = 0.05 ether;
    uint public DoNotDisturb = 0.01 ether;
    // 계약의 최소비용을 잘 조절해야 한다.
    // 계약 파기 등으로 우리가 돈을 반환할 때 손해를 볼 수 있기 때문.
    // 수수료 비율 또한 잘 조절해야 한다.
    //
    
    uint Coinjob_ether = 0;
    uint public fee_numerator = 10;
    uint public fee_denominator = 100;
    
    address public owner;
    
    
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    constructor(){
        owner = msg.sender;
    }
    
    function adjustPostContract(uint value) onlyOwner public{
        postContract = value;
    }
    
    function adjustDoNotDisturb(uint value) onlyOwner public{
        DoNotDisturb = value;
    }

    function adjustFee(uint numerator, uint denominator) onlyOwner public{
        fee_numerator = numerator;
        fee_denominator = denominator;
    }
    
    function viewBalance() view onlyOwner public returns (uint256 b,uint256 o){
        b = address(this).balance;
        o = owner.balance;
    }
    
    function ownerMoney(uint value) onlyOwner public{
        payable(owner).transfer(value);
    }
    
    function paying(address addr, uint value) private{
        payable(addr).transfer(value * (fee_denominator - fee_numerator) / fee_denominator);
    } 
    
    function publishJob(string memory _title, string memory _content,uint _dontdisturb, uint _deadline) payable public { // dontdisturb 단위는 ether
        require(msg.value >= postContract, "Job Reward is too cheap");
        require(_dontdisturb >= DoNotDisturb, "DoNotDisturb is too cheap");
        uint deadline = block.timestamp + _deadline;
        Job memory newJob = Job(job.length, msg.sender, _title, _content, deadline, msg.value,_dontdisturb,false, msg.sender,"", status.open);
        job.push(newJob);
        emit jobRefresh();
    }
    
    function allJob() public view returns (Job[] memory){
        return job;
    }
    
    function acceptJob(uint _number, string memory _contact) payable public {
        require(_number < job.length && _number >= 0, "You Are Looking For A Wrong Job");
        Job storage _thisjob = job[_number];
        require(msg.sender != _thisjob.writer, "You Can't Co-Work with Yourself");
        require(_thisjob.stat != status.finish, "This Job is Done. Job Good Job Bad Job");
        require(!_thisjob.accepted, "Job In Progress");
        require(msg.value == _thisjob.dontdisturb, "You Should Pay to show you are not scammer ( your money will payback after job is done )");
        _thisjob.accepter = msg.sender;
        _thisjob.accepted = true;
        _thisjob.contact = _contact;
        emit jobRefresh();
    }
    
    function workDone(uint _number) public {
        require(_number < job.length && _number >= 0, "You Are Looking For A Wrong Job");
        Job storage _thisjob = job[_number];
        require(msg.sender == _thisjob.accepter, "You Are Not the Member of Job. Please Check your Wallet Address");
        require(_thisjob.stat != status.finish, "This Job is Done. Job Good Job Bad Job");
        _thisjob.stat = status.workerDone;
        emit jobRefresh();
    }
    
    function finishJob(uint _number) public {
        Job storage _thisjob = job[_number];
        require(_thisjob.stat == status.workerDone, "Worker doesn't finised job or Already finished job");
        require(msg.sender == _thisjob.writer, "Only Writer can finish the job");
        _thisjob.stat = status.finish;
        paying(_thisjob.accepter, (_thisjob.reward + _thisjob.dontdisturb));
        emit jobRefresh();
    }

    function giveupJob(uint _number) public {
        require(_number < job.length && _number >= 0, "You Are Looking For A Wrong Job");
        Job storage _thisjob = job[_number];
        require(msg.sender == _thisjob.accepter, "You Are Not the Member of Job. Please Check your Wallet Address");
        require(_thisjob.stat != status.finish, "This Job is Done. Job Good Job Bad Job");
        if (msg.sender == _thisjob.writer){
            require(!_thisjob.accepted, "You Can not Close Your Job while Someone is Working for you");
            _thisjob.stat = status.finish;
            paying(_thisjob.writer ,_thisjob.reward);
        }
        else{
            require(_thisjob.accepted, "Job Is Not Started. So There is no way to give up");
            _thisjob.accepted = false;
            _thisjob.contact = "";
            paying(_thisjob.accepter,_thisjob.dontdisturb);
            _thisjob.accepter = _thisjob.writer;
        }
        jobRefresh();
    }

    function getPaginatedSquares( uint256 _page, uint256 _resultsPerPage  )  public  view returns (Job[] memory)
    {
        uint256 _jobIndex = _resultsPerPage * _page - _resultsPerPage;
        
        if (
            job.length == 0 || 
            _jobIndex > job.length - 1
        ) {
            return new Job[](0);
        }
        
        uint _size = _resultsPerPage;
        if ( _page * _resultsPerPage > job.length ){
            _size = job.length % _resultsPerPage;
        }
        Job[] memory _jobs = new Job[](_size);
        uint256 _returnCounter = 0;
        for ( _jobIndex; _jobIndex < _resultsPerPage * _page;  _jobIndex++ ) {
            if (_jobIndex < job.length) {
                _jobs[_returnCounter] = job[_jobIndex];
            } else {
                break;
            }
            _returnCounter ++;
        }
        
        return _jobs;
    }

}
