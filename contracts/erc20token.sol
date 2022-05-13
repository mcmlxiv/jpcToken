//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract DevToken is ERC20Capped{
	//capped at 1000000 tokens with an initial supply of 100000
	uint256 public initialSupply = 100000 * (10 ** 18);
	constructor() ERC20("JOHN", "JPC") ERC20Capped(1000000 * (10 ** 18)) {
		ERC20._mint(msg.sender, initialSupply);
	}
	//Refill the contract with more tokens
	function issueTokens(address receiver, uint256 amount)external{
		_mint(receiver, amount);
	}

	
}