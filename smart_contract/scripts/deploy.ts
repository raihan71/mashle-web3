import { ethers } from 'ethers';
import * as contractJson from '../artifacts/contracts/Transactions.sol/Transactions.json';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const abi = contractJson.abi; // ABI from the compiled contract
const bytecode = contractJson.bytecode; // Bytecode from the compiled contract

const main = async () => {
  // Get sensitive data from environment variables
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  // Validate environment variables
  if (!rpcUrl) {
    throw new Error('RPC_URL environment variable is not set');
  }

  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is not set');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a ContractFactory with abi and bytecode
  const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);

  console.log('Deploying contract...');

  // Deploy the contract
  const contract = await ContractFactory.deploy();

  // Wait for the deployment transaction to be mined
  const deploymentTransaction = contract.deploymentTransaction();
  if (deploymentTransaction) {
    console.log('Waiting for deployment confirmation...');
    await deploymentTransaction.wait();
  } else {
    throw new Error('Deployment transaction is null');
  }

  console.log('Contract deployed to:', contract.target);
  console.log('Transaction hash:', deploymentTransaction?.hash);
};

main().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
