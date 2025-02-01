const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with the account:", deployer.address);

  // Get contract factory
  const TaskManager = await ethers.getContractFactory("TaskManager");
  console.log("📦 Contract factory retrieved...");

  // Deploy contract
  const taskManager = await TaskManager.deploy();
  console.log("⏳ Waiting for deployment...");

  try {
    await taskManager.waitForDeployment();
    console.log("✅ Deployment completed.");
    
    // Get deployed contract address
    const contractAddress = await taskManager.getAddress();
    console.log(`🎯 Contract deployed to: ${contractAddress}`);
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script error:", error);
    process.exit(1);
  });
