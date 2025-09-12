import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center flex-col p-4 gradient-bg-footer">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <h1 className="text-white text-xl font-bold">CryptoExchange</h1>
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Facebook
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Twitter
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            LinkedIn
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Instagram
          </p>
        </div>
      </div>
      <p className="text-white text-center text-sm">
        &copy; 2025 Mashle. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
