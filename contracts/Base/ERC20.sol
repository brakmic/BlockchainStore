pragma solidity ^0.4.10;

/**
      @notice Base Token contract according to ERC20
      https://github.com/ethereum/EIPs/issues/20
*/
contract ERC20 {
  function name() public constant returns (string name) { name; }
  function symbol() public constant returns (string symbol) { symbol; }
  function decimals() public constant returns (uint8 decimals) { decimals; }
  function totalSupply() public constant returns (uint256 totalSupply) { totalSupply; }
  function balanceOf(address who) constant returns (uint);
  function allowance(address owner, address spender) constant returns (uint);
  function transfer(address to, uint value) returns (bool ok);
  function transferFrom(address from, address to, uint value) returns (bool ok);
  function approve(address spender, uint value) returns (bool ok);
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}
