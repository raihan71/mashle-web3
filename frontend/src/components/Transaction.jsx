import React from 'react';

const Transaction = () => {
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          Latest Transactions
        </h3>
        <p className="text-white text-sm text-center mt-2">
          Explore the latest transactions on the Ethereum blockchain.
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-10">
        {/* Transaction cards will go here */}
      </div>
    </div>
  );
};

export default Transaction;
