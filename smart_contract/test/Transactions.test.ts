import { expect } from "chai";
import { ethers } from "hardhat";
import { Transactions } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Transactions Contract", function () {
  let transactions: Transactions;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const TransactionsFactory = await ethers.getContractFactory("Transactions");
    transactions = await TransactionsFactory.deploy();
    await transactions.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await transactions.getAddress()).to.be.properAddress;
    });

    it("Should have zero transactions initially", async function () {
      expect(await transactions.getTransactionCount()).to.equal(0);
    });

    it("Should return empty array for getAllTransactions initially", async function () {
      const txs = await transactions.getAllTransactions();
      expect(txs).to.be.an("array").that.is.empty;
    });
  });

  describe("Adding Transactions", function () {
    it("Should add a transaction successfully", async function () {
      const amount = ethers.parseEther("1.0");
      const message = "Test transaction";
      const keyword = "test";

      await expect(
        transactions.addToBlockchain(addr1.address, amount, message, keyword)
      )
        .to.emit(transactions, "Transfer")
        .withArgs(owner.address, addr1.address, amount, message, await ethers.provider.getBlockNumber() + 1, keyword);

      expect(await transactions.getTransactionCount()).to.equal(1);
    });

    it("Should increment transaction count correctly", async function () {
      const amount = ethers.parseEther("0.5");
      
      await transactions.addToBlockchain(addr1.address, amount, "First", "test1");
      expect(await transactions.getTransactionCount()).to.equal(1);
      
      await transactions.addToBlockchain(addr2.address, amount, "Second", "test2");
      expect(await transactions.getTransactionCount()).to.equal(2);
    });

    it("Should store transaction details correctly", async function () {
      const amount = ethers.parseEther("2.5");
      const message = "Detailed test transaction";
      const keyword = "detailed";

      await transactions.addToBlockchain(addr1.address, amount, message, keyword);

      const allTxs = await transactions.getAllTransactions();
      expect(allTxs).to.have.lengthOf(1);

      const tx = allTxs[0];
      expect(tx.sender).to.equal(owner.address);
      expect(tx.receiver).to.equal(addr1.address);
      expect(tx.amount).to.equal(amount);
      expect(tx.message).to.equal(message);
      expect(tx.keyword).to.equal(keyword);
      expect(tx.timestamp).to.be.above(0);
    });
  });

  describe("Retrieving Transactions", function () {
    beforeEach(async function () {
      // Add some test transactions
      await transactions.addToBlockchain(addr1.address, ethers.parseEther("1"), "First tx", "test1");
      await transactions.addToBlockchain(addr2.address, ethers.parseEther("2"), "Second tx", "test2");
      await transactions.connect(addr1).addToBlockchain(addr2.address, ethers.parseEther("0.5"), "Third tx", "test3");
    });

    it("Should return all transactions", async function () {
      const allTxs = await transactions.getAllTransactions();
      expect(allTxs).to.have.lengthOf(3);
    });

    it("Should return correct transaction count", async function () {
      expect(await transactions.getTransactionCount()).to.equal(3);
    });

    it("Should return transactions by address correctly", async function () {
      const addr1Txs = await transactions.getTransactionsByAddress(addr1.address);
      expect(addr1Txs).to.have.lengthOf(2); // addr1 is receiver in 1st tx and sender in 3rd tx

      const addr2Txs = await transactions.getTransactionsByAddress(addr2.address);
      expect(addr2Txs).to.have.lengthOf(2); // addr2 is receiver in 2nd and 3rd tx

      const ownerTxs = await transactions.getTransactionsByAddress(owner.address);
      expect(ownerTxs).to.have.lengthOf(2); // owner is sender in 1st and 2nd tx
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event with correct parameters", async function () {
      const amount = ethers.parseEther("1.5");
      const message = "Event test";
      const keyword = "event";

      const blockNumber = await ethers.provider.getBlockNumber();
      
      await expect(
        transactions.addToBlockchain(addr1.address, amount, message, keyword)
      )
        .to.emit(transactions, "Transfer")
        .withArgs(owner.address, addr1.address, amount, message, blockNumber + 1, keyword);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transactions", async function () {
      await transactions.addToBlockchain(addr1.address, 0, "Zero amount", "zero");
      expect(await transactions.getTransactionCount()).to.equal(1);
    });

    it("Should handle empty message and keyword", async function () {
      await transactions.addToBlockchain(addr1.address, ethers.parseEther("1"), "", "");
      
      const allTxs = await transactions.getAllTransactions();
      const tx = allTxs[0];
      expect(tx.message).to.equal("");
      expect(tx.keyword).to.equal("");
    });

    it("Should handle same sender and receiver", async function () {
      await transactions.addToBlockchain(owner.address, ethers.parseEther("1"), "Self transaction", "self");
      expect(await transactions.getTransactionCount()).to.equal(1);
    });
  });
});