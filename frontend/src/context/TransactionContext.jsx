/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();
const { ethereum } = window;

const getEthereumContract = async () => {
  try {
    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const transactionContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer,
      );

      console.log({
        provider,
        signer,
        transactionContract,
      });

      return transactionContract;
    }
  } catch (error) {
    console.log(error);
    throw new Error('No ethereum object.');
  }
};

export const TransactionProvider = ({ children }) => {
  const [loadng, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [transactionCount, setTransactionCount] = useState(0);
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  });

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getEthereumContract();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object.');
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object.');
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount('');
    ethereum.selectAddress = null;
    console.log('Wallet disconnected');
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();
      const parsedAmount = ethers.parseEther(amount);
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // 21000 Gwei
            value: parsedAmount._hex, // 0.00001
          },
        ],
      });
      setLoading(true);

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      );
      console.log(`Loading - ${transactionHash.hash}`);
      const transactions = await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      try {
        const count = await transactionContract.getTransactionCount();
        console.log('Transaction count:', count);
      } catch (countError) {
        console.warn('Could not update transaction count:', countError);
      }
      setLoading(false);

      setFormData({
        addressTo: '',
        amount: '',
        keyword: '',
        message: '',
      });

      return transactions;
    } catch (error) {
      console.error('Transaction failed:', error);
      setLoading(false);
      // Better error handling
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message.includes('No ethereum object')) {
        throw new Error('Please install MetaMask and refresh the page');
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};
