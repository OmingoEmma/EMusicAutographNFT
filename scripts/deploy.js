const { ethers } = require("hardhat");
async function main() {
  // Get the deployer's account 
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with address:", deployer.address);

  // Get the contract factory and deploy
  const EMusicAutographNFT = await ethers.getContractFactory("EMusicAutographNFT");
  const contract = await EMusicAutographNFT.deploy(deployer.address); // constructor arg: initialOwner

  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("EMusicAutographNFT deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(" Deployment failed:", error);
  process.exitCode = 1;
});
