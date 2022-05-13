import React from "react";
import { ethers } from "ethers";
import { contractAddressERC721 } from "./config";
import { useState } from "react";
import { Button, Loading } from "./Button";
import Tokenizer from "./Tokenizer.json";

const Mint = () => {
  const [nftCount, setNFTCount] = useState(0);
  const [status, setStatus] = useState(0);
  const [txnLoading, setTxnLoading] = useState(false);
  const [mintedNFT, setMintedNFT] = useState("");

  const STATUS_STATES = ["Mint NFT", Loading("Minting"), "Done  ✔"];
  const STATUS_COLORS = [
    "bg-gradient-to-r from-green-500 to-blue-400",
    "bg-gradient-to-r from-blue-400 to-green-500",
    "bg-blue-300",
  ];

  const tokensERC721 = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenizerContract = new ethers.Contract(
          contractAddressERC721,
          Tokenizer.abi,
          signer
        );

        let count = await tokenizerContract.getTotalMinted();
        console.log("Retrieved total minted count...", count.toNumber());

        const tokenTxn = await tokenizerContract.mintToken();
        console.log("Mining...", tokenTxn.hash);
        await tokenTxn.wait();
        setTxnLoading((prevState) => !prevState);
        console.log("Minted --", tokenTxn.hash);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${tokenTxn.hash}`
        );
        setMintedNFT(tokenTxn.hash);
        count = await tokenizerContract.getTotalMinted();
        console.log("Retrieved total minted count...", count.toNumber());
        setNFTCount(count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (status !== 1) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);

      if (newStatus === 1) {
        return tokensERC721();
      }
    }
  };
  if (status === 1) {
    if (txnLoading) {
      const newStatus = (status + 1) % STATUS_STATES.length;
      setStatus(newStatus);
    }
  }

  const text = STATUS_STATES[status];

  return (
    <div>
      <div className={"flex items-center flex-col justify-center mt-6"}>
        <div className={" flex items-center flex-col justify-center gap-8"}>
          <span className="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
            Mint an NFT
          </span>
          <Button
            onClick={handleClick}
            text={text}
            color={STATUS_COLORS[status]}
          />
        </div>
        <div className="mt-8  text-center text-gray-400">
          <div className=" font-semibold mb-4 mt-4">
            <a
              href={`https://rinkeby.rarible.com/collection/${contractAddressERC721}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="hover:underline hover:underline-offset-8 ">
                View Collection on Rarible
              </span>
            </a>
          </div>
          <div>
            {status === 2 && (
              <div
                className={"flex items-center justify-center flex-col gap-2"}
              >
                <div className=" font-semibold  mt-4 cursor-auto">
                  <a
                    href={`https://rinkeby.etherscan.io/tx/${mintedNFT}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="hover:underline hover:underline-offset-8 ">
                      View transaction on Rinkeby Etherscan!
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="mt-8 text-gray-400">
              Total Supply: {nftCount.toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
