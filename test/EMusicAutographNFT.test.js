const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EMusicAutographNFT - Complete Coverage", function () {
  let contract, owner, user1, user2;
  const baseURI = "ipfs://bafybeig6ctlvzrmcpz5k36jsn6z3fwxjp5pmii72n3bxkggfhjeebyhb44/";

  //Link on Pinata: https://ipfs.io/ipfs/bafybeig6ctlvzrmcpz5k36jsn6z3fwxjp5pmii72n3bxkggfhjeebyhb44/

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("EMusicAutographNFT");
    contract = await Factory.deploy(owner.address);
    await contract.waitForDeployment();
  });

  describe("Initialization", function () {
    it("should initialize with correct name and symbol", async () => {
      expect(await contract.name()).to.equal("EMusicAutographNFT");
      expect(await contract.symbol()).to.equal("EMAUTO");
    });

    it("should initialize with correct owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should support ERC721 interface", async () => {
      const ERC721InterfaceId = "0x80ac58cd";
      expect(await contract.supportsInterface(ERC721InterfaceId)).to.be.true;
    });
  });

  describe("Minting and token management", function () {
    it("should mint an NFT with correct tokenURI", async () => {
      await contract.safeMint(user1.address);
      const tokenURI = await contract.tokenURI(0);
      expect(tokenURI).to.equal(baseURI + "0.json");
    });

    it("should increment tokenId after minting", async () => {
      await contract.safeMint(user1.address);
      expect(await contract.nextTokenId()).to.equal(1);
      
      await contract.safeMint(user2.address);
      expect(await contract.nextTokenId()).to.equal(2);
    });

    it("should allow public to buy an NFT", async () => {
      await contract.connect(user1).buyAutograph({ value: ethers.parseEther("0.01") });
      const tokenURI = await contract.tokenURI(0);
      expect(await contract.ownerOf(0)).to.equal(user1.address);
      expect(tokenURI).to.equal(baseURI + "0.json");
    });

    it("should emit Transfer event when minting", async () => {
      await expect(contract.safeMint(user1.address))
        .to.emit(contract, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, 0);
    });

    it("should emit Transfer event when buying", async () => {
      await expect(contract.connect(user1).buyAutograph({ value: ethers.parseEther("0.01") }))
        .to.emit(contract, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, 0);
    });
  });

  describe("Price management", function () {
    it("should allow owner to set price", async () => {
      const newPrice = ethers.parseEther("0.02");
      await contract.setPrice(newPrice);
      expect(await contract.price()).to.equal(newPrice);
    });

    it("should revert if non-owner tries to set price", async () => {
      const newPrice = ethers.parseEther("0.02");
      await expect(
        contract.connect(user1).setPrice(newPrice)
      ).to.be.reverted;
    });

    it("should revert if ETH sent is below price", async () => {
      await expect(
        contract.connect(user1).buyAutograph({ value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Insufficient ETH");
    });
  });

  describe("Transfers and approvals", function () {
    it("should allow transfer of NFT using transferFrom", async () => {
      await contract.safeMint(user1.address);
      await contract.connect(user1).transferFrom(user1.address, user2.address, 0);
      expect(await contract.ownerOf(0)).to.equal(user2.address);
    });

    it("should allow transfer of NFT using safeTransferFrom", async () => {
      await contract.safeMint(user1.address);
      await contract.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 0);
      expect(await contract.ownerOf(0)).to.equal(user2.address);
    });

    it("should allow approve and getApproved", async () => {
      await contract.safeMint(user1.address);
      await contract.connect(user1).approve(user2.address, 0);
      const approved = await contract.getApproved(0);
      expect(approved).to.equal(user2.address);
    });

    it("should emit Approval event when approving", async () => {
      await contract.safeMint(user1.address);
      await expect(contract.connect(user1).approve(user2.address, 0))
        .to.emit(contract, "Approval")
        .withArgs(user1.address, user2.address, 0);
    });

    it("should allow setApprovalForAll and isApprovedForAll", async () => {
      await contract.safeMint(user1.address);
      await contract.connect(user1).setApprovalForAll(user2.address, true);
      expect(await contract.isApprovedForAll(user1.address, user2.address)).to.be.true;
    });

    it("should emit ApprovalForAll event when setting approval for all", async () => {
      await expect(contract.connect(user1).setApprovalForAll(user2.address, true))
        .to.emit(contract, "ApprovalForAll")
        .withArgs(user1.address, user2.address, true);
    });
  });

  describe("Fund management", function () {
    it("should allow the owner to withdraw funds", async () => {
      await contract.connect(user1).buyAutograph({ value: ethers.parseEther("0.01") });
      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await contract.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.greaterThan(initialBalance - gasUsed);
    });

    it("should not allow non-owner to withdraw funds", async () => {
      await contract.connect(user1).buyAutograph({ value: ethers.parseEther("0.01") });
      await expect(contract.connect(user1).withdraw()).to.be.reverted;
    });
  });

  describe("Token information", function () {
    it("should show correct balanceOf for NFT owner", async () => {
      await contract.safeMint(user1.address);
      expect(await contract.balanceOf(user1.address)).to.equal(1);
    });

    it("should return correct ownerOf a token", async () => {
      await contract.safeMint(user1.address);
      expect(await contract.ownerOf(0)).to.equal(user1.address);
    });
  });
});