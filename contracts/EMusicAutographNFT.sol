// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EMusicAutographNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public nextTokenId;
    uint256 public price = 0.01 ether;

    // IPFS folder CID for metadata
    string public baseURI = "ipfs://bafybeig6ctlvzrmcpz5k36jsn6z3fwxjp5pmii72n3bxkggfhjeebyhb44/";

    constructor(address initialOwner) ERC721("EMusicAutographNFT", "EMAUTO") {
  
        transferOwnership(initialOwner);
    }

// In OpenZeppelin v5.x that is the default on Remix, Ownable accepts an address in its constructor,
// so kindly requesting to use Ownable(initialOwner) directly and skip transferOwnership. THrefore use this instead:
    //constructor(address initialOwner) 
        //ERC721("EMusicAutographNFT", "EMAUTO") 
        //Ownable(initialOwner) // Pass initialOwner directly to Ownable constructor
        //ReentrancyGuard() 
    //{
        // No longer need to call transferOwnership
    //}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string.concat(baseURI, tokenId.toString(), ".json"));
        nextTokenId++;
    }

    function buyAutograph() public payable nonReentrant {
        require(msg.value >= price, "Insufficient ETH");
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string.concat(baseURI, tokenId.toString(), ".json"));
        nextTokenId++;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
//Safe mint to owner
//Approve to recipient with
//TokenId:0

//Transfer from
//Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//REcipient:0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//tokenId:0


