pragma solidity ^0.4.10;

import "../Base/ERC20.sol";
import "../Base/SafeMath.sol";

/**  @title Base Store Token
     @dev Basic Store Token with a fix for short address attacks on ERC20
*/
contract BaseStoreToken is ERC20, SafeMath {
    mapping (address => uint256) balances;
	  mapping (address => mapping (address => uint256)) allowed;

	  uint256 public totalSupply;
	  uint256 public initialSupply;
	  string public name;
	  string public symbol;
	  uint8 public decimals;

    /**
        @notice Fix for the ERC20 short address attack.
        @param size data length
    */
    modifier onlyPayloadSize(uint256 size) {
        if(msg.data.length < size + 4) {
          throw;
        }
        _;
    }

    /**
        @notice accept only valid addresses
        @param _address Memory address
    */
    modifier onlyValidAddress(address _address) {
        require(_address != 0x0);
        _;
    }

    /**
          @notice Default constructor
    */
	  function BaseStoreToken(){
  		initialSupply = 10000;
  		totalSupply = initialSupply;
  		balances[msg.sender] = initialSupply;
  		name = "Base Store Token";
  		symbol = "BST";
  		decimals = 0;
	  }
    /**
          @notice Transfer token to specified address
          @param _to Address to transfer token to
          @param _value Value to be transferred
    */
	  function transfer(address _to, uint256 _value)
                                                  onlyPayloadSize(2 * 32)
                                                  onlyValidAddress(_to)
                                                                returns (bool) {
	    balances[msg.sender] = safeSub(balances[msg.sender], _value);
	    balances[_to] = safeAdd(balances[_to], _value);
	    Transfer(msg.sender, _to, _value);
	    return true;
  	}
    /**
          @notice Transfer tokens between adresses
          @param _from Source address
          @param _to Target address
          @param _value Amount of tokens to be transferred
    */
  	function transferFrom(address _from, address _to, uint256 _value)
                                                      onlyValidAddress(_from)
                                                      onlyValidAddress(_to)
                                                                returns (bool) {
	    var _allowance = allowed[_from][msg.sender];
	    balances[_to] = safeAdd(balances[_to], _value);
	    balances[_from] = safeSub(balances[_from], _value);
	    allowed[_from][msg.sender] = safeSub(_allowance, _value);
	    Transfer(_from, _to, _value);
	    return true;
  	}
    /**
          @notice Approve the given address to spend the specified amounts of
          tokens on behalf of msg.sender
          @param _spender Spender of the funds
          @param _value Amounf of tokens to be spent
    */
  	function approve(address _spender, uint256 _value)
                                                    onlyValidAddress(_spender)
                                                                returns (bool) {
    	allowed[msg.sender][_spender] = _value;
    	Approval(msg.sender, _spender, _value);
    	return true;
  	}
    /**
          @notice Returns the balance for the given address
          @param _address Address whose balance should be queried
          @return uint256 Represents the balance
    */
  	function balanceOf(address _address) onlyValidAddress(_address)
                                            constant returns (uint256 balance) {
  		return balances[_address];
  	}
    /**
          @notice Checks the amount of tokens allowed by owner to a spender
          @param _owner Token owner's address
          @param _spender Spender's address
          @return uint256 Amount of tokens available to the spender
    */
  	function allowance(address _owner, address _spender)
                                                   onlyValidAddress(_owner)
                                                   onlyValidAddress(_spender)
                                                   constant
                                                   returns (uint256 remaining) {
    	return allowed[_owner][_spender];
  	}
}
