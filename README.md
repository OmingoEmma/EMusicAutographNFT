# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# 🎵 EMusicAutographNFT – ERC721 NFT Smart Contract

A blockchain project built with Solidity and IPFS, showcasing an original NFT minting system for artist autographs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-lightgrey)
![Platform](https://img.shields.io/badge/Tested%20On-Remix-orange)

---

## 📚  Project


- **Blockchain Developer**: Emma A. Omingo  
- **Email**: emmaomingo@gamil.com 


## 🚀 Project Overview

**EMusicAutographNFT** is a smart contract built using the ERC721 standard that allows artists to mint and sell **digital autograph NFTs** to fans. Each autograph is a unique, collectible asset, permanently stored on IPFS.

This project reflects how blockchain can support **fair creator rewards**, **fan engagement**, and **digital ownership** in the music industry.

---

## 🔧 Tech Stack

- **Solidity (v0.8.20)**
- **Remix IDE** for development and testing
- **IPFS (via Pinata)** for metadata hosting
- **OpenZeppelin Contracts** for secure implementation
- **MetaMask (optional)** for wallet testing
- **JavaScript VM (Remix)** for local deployment

---

## 🧠 Key Features

✅ ERC721-compliant NFT contract  
✅ IPFS-based metadata for each NFT  
✅ `safeMint` function (onlyOwner)  
✅ `buyAutograph()` public mint with ETH  
✅ Adjustable `setPrice()` logic  
✅ `withdraw()` for collecting contract funds  
✅ Fully demoed on Remix IDE with multiple accounts

---

## 📂 IPFS Metadata

All NFTs link to metadata hosted on IPFS using a base URI:


Each token maps to metadata like:
- `0.json` – Autograph #1
- `1.json` – Autograph #2
- ...

Example metadata includes name, description, image, and attributes such as artist name and genre.

---

## 🎬 Remix Demo Workflow

1. **Deploy Contract** – Input your wallet address as `initialOwner`
2. **Mint NFT (`safeMint`)** – Owner mints autograph NFTs
3. **Check Ownership (`balanceOf`, `ownerOf`)** – Confirm NFT status
4. **Buy NFT (`buyAutograph`)** – Another account buys NFT with ETH
5. **Transfer NFT (`transferFrom`)** – Transfer ownership between wallets
6. **Withdraw Funds** – Owner collects ETH using `withdraw`

---

## 📈 Why Autograph NFTs?

This project uses **digital autographs** instead of tickets because:

- Autographs are **non-fungible and unique** — ideal for ERC721
- They’re **collectible, long-lasting, and retain value**
- Unlike tickets, they **don’t expire or lose utility**
- Enhance **fan–artist connection** through exclusive content

Tickets (especially bulk/identical ones) would better suit **ERC1155** due to batch minting and mixed token types.

---

## 📜 Sample Smart Contract Snippet

```solidity
function safeMint(address to) public onlyOwner {
    uint256 tokenId = nextTokenId;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, string.concat(baseURI, tokenId.toString(), ".json"));
    nextTokenId++;
}


