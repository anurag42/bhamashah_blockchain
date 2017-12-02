pragma solidity ^ 0.4 .11;

import "./MyToken.sol";

contract FertIssue is MyToken {
  address owner;

  event LogSubmitted(address indexed userHash);
  event LogGetKYChash(address indexed userHash, bytes hash);

  /**
   * The user structure: every registry contract is composed of:
   * - Hash of KYC document bytecode
   */
  struct user {
    bytes[3] kyc;
    uint index;
  }

  /**
   * Mapping for contract registry.
   */
  mapping(address => user) userdir;

  /** Sets status for each document being stored in contract
   * Initial Status - NOT_YET_UPLOADED
   * Once Document is uploaded, status would be set to REVIEW_PENDING
   * The Doc would then be reviewed by trade parties and corresponding
   * Approve/Reject action would be carried out.
   **/
  enum Status {
    NOT_CLAIMED,
    PARTIAL_CLAIMED,
    CLAIMED,
    EXPIRED
  }

  /*
      MODIFIERS
    ========================================================================
  */
  /**
   * Set permission so that owner can be the only accessor
   */
  modifier onlyBy() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  /**
   * @param versiondir - Stores each document against it's version number
   * @param status - Current Status of each doc involved in the Trade
   * @param version - Indicates the latest version number
   **/
  struct FertAssign {
    uint amount;
    uint issueDate;
    mapping(uint => uint) claimDates;
    uint index;
  }

  mapping(bytes32 => FertAssign) issued;

  /**
   EVENTS
  */
  event LogFertIssued(address indexed sender);
  event LogFertClaimed(bytes32 indexed uid, bytes32 indexed claimedBy, address indexed dealer, uint claimAmount);
  event LogRedeemed(address indexed sender, uint redeemAmount);
  event LogDeposit(bytes32 uid, uint amount);

  /**
   * User can submit a KYC document for acceptance into registry.
   */
  function submitKYC(bytes32 _userID, address _userHash, bytes KYChash) onlyBy() returns(bool) {
    AadhaarIDByAddress[_userHash] = _userID;
    userdir[_userHash].kyc[userdir[_userHash].index] = KYChash;
    userdir[_userHash].index++;
    /* Event to keep a log of function execution */
    LogSubmitted(_userHash);
  }

  /**
   * Function that returns KYChash
   */
  function getKYChash(address _hash) onlyBy() {
    for (uint i = 0; i < userdir[_hash].index; i++) {
      LogGetKYChash(_hash, userdir[_hash].kyc[i]);
    }
  }

  function FertIssue(uint256 _initialAmount,
    string _tokenName,
    uint8 _decimalUnits,
    string _tokenSymbol,
    bytes32 _ownerID) MyToken(_initialAmount,
    _tokenName,
    _decimalUnits,
    _tokenSymbol,
    _ownerID) {
    owner = msg.sender;
  }

  function recordFertIssue(address sender, bytes32[] recepients, uint[] tokenAmounts) {
    uint sum = 0;
    for (uint i = 0; i < tokenAmounts.length; i++) {
      sum += tokenAmounts[i];
    }
    bytes32 senderID = AadhaarIDByAddress[sender];
    require(balances[senderID] >= sum);
    balances[senderID] -= sum;

    //Assuming issue of fertlizer is a one-time process
    for (uint j = 0; j < recepients.length; j++) {
      issued[recepients[j]].amount = tokenAmounts[j];
      issued[recepients[j]].issueDate = now;
      balances[recepients[j]] = tokenAmounts[j];
    }
    LogFertIssued(sender);
  }