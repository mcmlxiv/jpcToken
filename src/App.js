import React, { useEffect, useState } from "react";
import "./App.css";
import Faucet from "./Faucet";
import Mint from "./Mint";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account[0]);
        setCurrentAccount(account[0]);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //check if the wallet is connected to Rinkeby
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const rinkebyChainId = "0x4";

      const devChainId = 1337;
      const localhostChainId = `0x${Number(devChainId).toString(16)}`;

      if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
        alert("You are not connected to the Rinkeby Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="w-full  pb-12 antialiased bg-white">
      <div className=" flex items-center justify-center flex-col gap-14 mx-auto ">
        <div className={" relative z-50 h-24 select-non w-full"}>
          <div
            className={
              " gap-32 container relative flex flex-wrap items-center justify-between h-24 mx-auto overflow-hidden font-medium border-b border-gray-200 md:overflow-visible lg:justify-center sm:px-4 md:px-2"
            }
          >
            <div className="inline-block py-4 md:py-0">
              <span
                className={"p-1 text-4xl font-black leading-none text-gray-900"}
              >
                <span>Tokenizer</span>
                <span className={" text-6xl text-indigo-600"}>.</span>
              </span>
            </div>
            <div className="mt-8 text-gray-400 ">
              Mint NFTs or Get issued some JP coins!
            </div>
          </div>
        </div>

        {currentAccount && (
          <div className={"flex justify-center items-center flex-col gap-20"}>
            <Mint />
            <Faucet />
          </div>
        )}

        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <div className={"flex flex-col items-center mt-12 text-center"}>
            <span className={"relative inline-flex w-full md:w-auto"}>
              <button
                onClick={connectWallet}
                className={
                  "inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                }
              >
                Connect Wallet
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
