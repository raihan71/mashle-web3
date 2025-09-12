import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Starting contract interaction...");
  
  // Get signers
  const [owner, addr1, addr2] = await ethers.getSigners();
  
  // Get the deployed contract (replace with your deployed address)
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace this
  const Transactions = await ethers.getContractFactory("Transactions");
  const transactions = Transactions.attach(contractAddress);
  
  console.log("📝 Contract attached at:", contractAddress);
  
  // Add a transaction
  console.log("➕ Adding transaction to blockchain...");
  const tx = await transactions.addToBlockchain(
    addr1.address,
    ethers.parseEther("0.1"),
    "Test transaction from script",
    "test"
  );
  
  await tx.wait();
  console.log("✅ Transaction added! Hash:", tx.hash);
  
  // Get transaction count
  const count = await transactions.getTransactionCount();
  console.log("📊 Total transactions:", count.toString());
  
  // Get all transactions
  const allTransactions = await transactions.getAllTransactions();
  console.log("📋 All transactions:", allTransactions.length);
  
  // Display transaction details
  if (allTransactions.length > 0) {
    const latestTx = allTransactions[allTransactions.length - 1];
    console.log("🔍 Latest transaction details:");
    console.log("  From:", latestTx.sender);
    console.log("  To:", latestTx.receiver);
    console.log("  Amount:", ethers.formatEther(latestTx.amount), "ETH");
    console.log("  Message:", latestTx.message);
    console.log("  Keyword:", latestTx.keyword);
    console.log("  Timestamp:", new Date(Number(latestTx.timestamp) * 1000).toISOString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Interaction failed:", error);
    process.exit(1);
  });