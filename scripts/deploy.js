
const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const tokenFactory = await hre.ethers.getContractFactory("Tokenizer");
  const token = await tokenFactory.deploy();
  await token.deployed()

  console.log("John deployed to:", token.address);

  let txn = await token.mintToken();
    // let txn = await token.mintToken('0xA22988180334514576627A8A94CEc14EC34e02bA');

    await txn.wait();
    console.log("Minted NFT #1")

  // let burnt = await token._burn(0);
  // await burnt;


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
