pragma solidity 0.6.7;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

//import "github/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RequestChain is ERC20 {
    enum Category {
        Food,
        Clothing,
        Furniture,
        Education,
        Transportation,
        Medical,
        Funding
    }

    struct Charity {
        string charityName;
        address ID;
        string request;
        uint256 members;
        string primaryContact;
        bool urgent;
        uint256 tokenReward;
        bool isSelected;
        Category category;
        uint256 expiry;
        uint256 entryTime;
    }

    struct Supplier {
        string supplierName;
        address ID;
        uint256 members;
        string primaryContact;
        Category category;
        uint256 entryTime;
    }

    string[] private charityArr;
    address private owner;
    mapping(string => string) private char2Supp;
    mapping(string => mapping(string => uint)) private timeLimit;
    mapping(string => Charity) private Charities;
    mapping(string => Supplier) private Suppliers;
    mapping(string => uint256) private complete;
    mapping(string => uint256) private incomplete;
    
    event LogNewCharity(
        string charityName,
        address ID,
        string request,
        string primaryContact,
        bool urgent,
        uint256 tokenReward
    );
    event LogNewSupplier(
        string supplierName,
        address ID,
        string primaryContact
    );
    event LogSelectCharity(
        string charityName,
        string supplier,
        bool completedSelection
    );
    event LogDeleteCharity(
        string charityName,
        bool completedDeletion
    );

    constructor() ERC20("Charity Token", "CTKN") public {
        // Initially assign all tokens to the contract's creator.
        owner = msg.sender;
        uint256 initialSupply = 1000000;
        _mint(owner, initialSupply);
    }
    
    modifier timeCheck(string memory charity) {
        require(
            block.timestamp <= Charities[charity].expiry,
            "Time to complete request is up. Token reward reverted!"
        );
        _;
    }
    
    function comp(string memory _a, string memory _b) internal pure returns(bool) {
        return keccak256(bytes(_a)) == keccak256(bytes(_b));
    }
    
    function getPair(string memory charity) public view returns(string memory contractor) {
        return char2Supp[charity];
    }

    function isCharity(string memory charity) 
        internal 
        view
        returns (bool) 
    {
        if (charityArr.length == 0) return false;
        return comp(charity, Charities[charity].charityName);
    }

    function isSupplier(string memory supplier)
        internal
        view
        returns (bool)
    {
        return comp(supplier, Suppliers[supplier].supplierName);
    }

    function isAddress(address ID, string memory name) 
        internal 
        view 
        returns (bool) 
    {
        return
            ID == Charities[name].ID || ID == Suppliers[name].ID;
    }

    function addRequest(
        string memory charity,
        address ID,
        string memory request,
        uint256 members,
        string memory primaryContact,
        bool urgent,
        Category category
    ) public {
        require(!isCharity(charity), "Will not allow duplicate Charities");
        require(!isAddress(ID, charity), "Will not allow duplicate IDs");
        Charity memory _charity = Charities[charity];
        _charity.charityName = charity;
        _charity.ID = ID;
        _charity.members = members;
        _charity.request = request;
        _charity.primaryContact = primaryContact;
        _charity.urgent = urgent;
        if (urgent == true) {
            _charity.tokenReward = 4;
        } else {
            _charity.tokenReward = 2;
        }
        _charity.category = category;
        _charity.isSelected = false;
        charityArr.push(charity);
        _charity.entryTime = now;
        emit LogNewCharity(
            charity,
            ID,
            request,
            primaryContact,
            urgent,
            _charity.tokenReward
        );
    }

    function getCharity(string memory charity)
        public
        view
        returns (
            address ID,
            uint256 members,
            string memory primaryContact,
            string memory request,
            Category category,
            uint256 tokenReward,
            bool isSelected,
            uint256 timestamp,
            uint deadline
        )
    {
        require(isCharity(charity), "Charity requested is not within list");
        Charity memory _charity = Charities[charity];
        return (
            _charity.ID,
            _charity.members,
            _charity.primaryContact,
            _charity.request,
            _charity.category,
            _charity.tokenReward,
            now < _charity.expiry,
            _charity.entryTime,
            _charity.expiry
        );
    }
    
    function requestCount() public view returns(uint256) {
        return charityArr.length;
    }
    
    function getRequest(uint256 i) public view returns(string memory charity) {
        return charityArr[i];
    }

    function addSupplier(
        string memory supplier,
        address ID,
        uint256 members,
        string memory primaryContact,
        Category category
    ) public {
        require(!isSupplier(supplier), "Will not allow duplicate Suppliers");
        require(!isAddress(ID, supplier), "Will not allow duplicate IDs");
        Supplier memory _supplier = Suppliers[supplier];
        _supplier.entryTime = now;
        _supplier.supplierName = supplier;
        _supplier.ID = ID;
        _supplier.members = members;
        _supplier.primaryContact = primaryContact;
        _supplier.category = category;
    
        emit LogNewSupplier(
            supplier,
            ID,
            primaryContact
        );
    }
    
    // needs for loop
    function pendingRequests(string memory supplier, uint i) public view returns(
        string memory charity,
        bool urgency,
        uint256 reward
    ) {
        if (Suppliers[supplier].category == Charities[charityArr[i]].category) {
            return (
                charityArr[i],
                Charities[charityArr[i]].urgent,
                Charities[charityArr[i]].tokenReward
            );
        }
    }
    
    function selectCharity(
        string memory charity,
        string memory supplier,
        address suppID
    ) public returns (bool isSelected) {
        if (now > Charities[charity].expiry) {
            Charities[charity].isSelected = false;
        }
        require(
            Suppliers[supplier].ID == suppID,
            "Contractor title does not match Address provided!"
        );
        require(
            Charities[charity].category == Suppliers[supplier].category,
            "Categories do not match appropriately"
        );
        require(
            Charities[charity].isSelected == false,
            "Charity has already been selected"
        );
        Charities[charity].expiry = block.timestamp + 2 minutes;
        timeLimit[charity][supplier] = Charities[charity].expiry;
        char2Supp[charity] = supplier;
        emit LogSelectCharity(
            charity,
            supplier,
            true
        );
        return Charities[charity].isSelected = true;
    }
    
    function delivery(
        string memory charity,
        string memory supplier,
        address suppID
    ) public {
        require(comp(char2Supp[charity], supplier),
            "Request is not selected by Contractor provided: Marked INCOMPLETE"
        );
        if (timeLimit[charity][supplier] > now) {
            incomplete[supplier]++;
            delete char2Supp[charity];
            delete timeLimit[charity][supplier];
        } else {
            deliverRequest(charity, supplier, suppID);
        }
    }

    function deliverRequest(
        string memory charity,
        string memory supplier,
        address suppID
    ) private timeCheck(charity) {
        uint tokens = Charities[charity].tokenReward * uint256(10)**decimals();
        _transfer(owner, suppID, tokens);
        complete[supplier]++;
        delete char2Supp[charity];
        delete timeLimit[charity][supplier];
        delete Charities[charity];
    }
    
    //needs for loop
    function popRequest(string memory charity, uint i) public {
        if (comp(charity, charityArr[i])) {
            charityArr[i] = charityArr[charityArr.length - 1];
            charityArr.pop();
        }
        emit LogDeleteCharity(charity, true);
    }
    
    function searchInfo(string memory x) public view {
        require(isCharity(x) || isSupplier(x), "No information listed for Search provided!");
        if (isCharity(x)) {
            getCharity(x);
        } else if (isSupplier(x)) {
            getSupplier(x);
        }
    }
    
    function getSupplier(string memory x) public view returns(
        address supplierID,
        uint256 members,
        Category category,
        string memory primaryContact,
        uint256 timestamp,
        uint completedRequests,
        uint incompletedRequests
    ) {
        Supplier memory _supplier = Suppliers[x];
        return (
            _supplier.ID,
            _supplier.members,
            _supplier.category,
            _supplier.primaryContact,
            _supplier.entryTime,
            complete[x],
            incomplete[x]
        );
    }
}
