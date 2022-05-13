import React, { useState } from "react";
import { Loading, Button } from "./Button";
import { contractAddressERC20 } from "./config";
import { ethers } from "ethers";
import DevToken from "./DevToken.json";
import SendToken from "./SendToken";

const Faucet = () => {
  //states for balance, to show balance, update button status and update txn status
  const [balance, setBalance] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [status, setStatus] = useState(0);
  const [txnLoading, setTxnLoading] = useState(false);

  //get total supply of funds in contract
  const getBalanceERC20 = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const devTokenContract = new ethers.Contract(
          contractAddressERC20,
          DevToken.abi,
          signer
        );
        const balance = await devTokenContract.balanceOf(account[0]);

        console.log("Balance: ", balance.toString());
        setBalance(String(balance));
        setShowBalance((prevState) => !prevState);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Increase Total Supply
  const faucet = async () => {
    console.log("entered");
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const devTokenContract = new ethers.Contract(
          contractAddressERC20,
          DevToken.abi,
          signer
        );
        const tokenTxn = await devTokenContract.issueTokens(account[0], 1000);
        tokenTxn.wait();
        setTxnLoading((prevState) => !prevState);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Button States
  const STATUS_STATES = ["Issue Tokens 🛁", Loading("Sending"), "Done  ✔"];
  const STATUS_COLORS = ["bg-blue-500", "bg-gray-800", "bg-green-600"];

  const text = STATUS_STATES[status];

  // Onclick for changing button states
  const handleClick = () => {
    if (status !== 1) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);

      if (newStatus === 1) {
        console.log("sent");
        return faucet();
      }
    }
  };
  if (status === 1) {
    if (txnLoading) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);
    }
  }

  return (
    <div>
      <div className={"flex items-center justify-center flex-col gap-8"}>
        <span className=" text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
          Balance, Issue,
          <span className="text-blue-600"> Transfer</span>
        </span>
        <Button
          onClick={handleClick}
          text={text}
          color={STATUS_COLORS[status]}
        />
        <button
          onClick={getBalanceERC20}
          className={
            "mx-3 w-52 rounded px-4 px-6 py-2 font-semibold text-white  bg-black text-xs shadow-sm"
          }
        >
          {showBalance ? balance : "Check balance"}
        </button>
        <div className={"my-4"}>
          <SendToken />
        </div>
        <div className=" font-semibold  mt-4 cursor-auto mt-8 text-gray-400">
          <a
            href={`https://rinkeby.etherscan.io/address/${contractAddressERC20}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="hover:underline hover:underline-offset-8 ">
              View token on Rinkeby Etherscan!
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
