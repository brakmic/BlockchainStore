pragma solidity ^0.4.10;

/**
    @notice Safe mathematical operations contract
*/
contract SafeMath {

  /**
        @notice Safely subtract two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z Result
  */
  function safeSub(uint256 x, uint256 y) internal returns (uint256) {
    assert(y <= x);
    return x - y;
  }
  /**
        @notice Safely add two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return uint256 Result
  */
  function safeAdd(uint256 x, uint256 y) internal returns (uint256) {
    uint256 z = x + y;
    assert(z >= x);
    return z;
  }
  /**
        @notice Safely multiply two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z uint256 Result
  */
  function safeMul(uint256 x, uint256 y) internal returns (uint256) {
    uint256 z = x * y;
    assert(x == 0 || z / x == y);
    return z;
  }
  /**
        @notice Safely divide two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z uint256 Result
  */
  function safeDiv(uint256 x, uint256 y) internal returns (uint256) {
    uint256 z = x / y;
    return z;
  }

}
