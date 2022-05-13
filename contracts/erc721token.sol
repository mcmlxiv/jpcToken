//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Tokenizer is ERC721, Pausable, Ownable,ERC721URIStorage, ERC721Burnable {
    //initialize tokenId inorder to autoincrement
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    uint256 totalMinted;
    //for testing
    string public collectionName;
    string public collectionSymbol;
    
    //emit upon Mint event or Burn event
    event newTokenMinted(address sender, uint256 tokenId);
    event tokenBurnt(address sender, uint256 tokenId);
    
    constructor() ERC721 ("JOHN","JPC"){
        collectionName = name();
        collectionSymbol = symbol();
        console.log('Token online');
    }
    
    //Mint token and autoincrement its tokenId
    function mintToken() public{
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, "https://jsonkeeper.com/b/TM0W");
        
        totalMinted++;
        _tokenIds.increment();
        console.log("A new token with ID %s was minted to %s",newTokenId,msg.sender);
        emit newTokenMinted(msg.sender, newTokenId);
    }
    
    //return the total number of minted tokens
    function getTotalMinted() public view returns(uint256){
        console.log("These many %d were minted", totalMinted);
        return totalMinted;
    }
    //toggle contract pause states
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    //pause contract functionality
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    //burn token
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        emit tokenBurnt(msg.sender,tokenId);
    }
    
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
}
