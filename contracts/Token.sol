pragma solidity ^ 0.4 .11;

contract Token {
  /// total amount of tokens
  uint256 public totalSupply;

  /// @param _owner The bytes32 Aadhaar ID from which the balance will be retrieved
  /// @return The balance
  function balanceOf(bytes32 _owner) constant returns(uint256 balance);

  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The bytes32 of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transfer(bytes32 _to, uint256 _value) returns(bool success);

  event Transfer(bytes32 indexed _from, bytes32 indexed _to, uint256 _value);
  event Approval(bytes32 indexed _owner, bytes32 indexed _spender, uint256 _value);
}

/*
You should inherit from StandardToken or, for a token like you would want to
deploy in something like Mist, see HumanStandardToken.sol.
(This implements ONLY the standard functions and NOTHING else.
If you deploy this, you won't have anything useful.)
.*/
contract StandardToken is Token {

  function transfer(bytes32 _to, uint256 _value) returns(bool success) {
    //Default assumes totalSupply can't be over max (2^256 - 1).
    //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
    //Replace the if with this one instead.
    //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
    bytes32 sender = AadhaarIDByAddress[msg.sender];
    if (balances[sender] >= _value && _value > 0) {
      balances[sender] -= _value;
      balances[_to] += _value;
      Transfer(sender, _to, _value);
      return true;
    } else {
      return false;
    }
  }

  function balanceOf(bytes32 _owner) constant returns(uint256 balance) {
    return balances[_owner];
  }

  mapping(bytes32 => uint256) balances;
  mapping(address => bytes32) AadhaarIDByAddress;
}