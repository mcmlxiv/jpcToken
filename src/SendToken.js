import React from "react";
import { Button, Loading } from "./Button";
import { useState } from "react";
import { ethers } from "ethers";
import { contractAddressERC20 } from "./config";
import DevToken from "./DevToken.json";

const SendToken = () => {
  //set states for userAccount that receives tokens
  //txnLoading for sending notification of completed transaction display buttons and other info
  //status to display button states
  const [userAccount, setUserAccount] = useState("");
  const [txnLoading, setTxnLoading] = useState(false);
  const [status, setStatus] = useState(0);

  //different button states
  const STATUS_STATES = ["Transfer 💰", Loading("Transferring"), "Done  ✔"];
  const STATUS_COLORS = [
    "bg-blue-600",
    "bg-gradient-to-r from-pink-300 via-purple-500 to-indigo-500",
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-300",
  ];

  const text = STATUS_STATES[status];

  //onClick func for managing button state
  const handleClick = () => {
    if (status !== 1) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);

      if (newStatus === 1) {
        console.log("sent");
        return sendTokens();
      }
    }
  };
  if (status === 1) {
    //Change from Sending status to Sent if txn is complete
    if (txnLoading) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);
    }
  }

  //interact with Contract and Send tokens to the address provided
  const sendTokens = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const devTokenContract = new ethers.Contract(
          contractAddressERC20,
          DevToken.abi,
          signer
        );
        //transfer 100 tokens to user address
        const transaction = await devTokenContract.transfer(userAccount, 100);
        transaction.wait();
        setTxnLoading((prevState) => !prevState);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex rounded bg-white w-[30rem]">
        <input
          type="text"
          className=" block w-full px-4 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          placeholder="Receiver 0x address will receive 100 coins"
          value={userAccount}
          onChange={(e) => setUserAccount(e.target.value)}
        />
        <Button
          onClick={handleClick}
          text={text}
          color={STATUS_COLORS[status]}
        />
      </div>
    </div>
  );
};

export default SendToken;
