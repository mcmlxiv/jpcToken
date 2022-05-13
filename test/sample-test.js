const { assert } = require("chai");
const hre = require("hardhat");

describe("Tokenizer Contract", function () {
  let token;
  let tokenContractAddress;
  let tokenId;

  // Deploys tokenFactory contract and Tokenizer contract before each test
  beforeEach("Setup Contract", async () => {
    const tokenFactory = await hre.ethers.getContractFactory("Tokenizer");
    token = await tokenFactory.deploy();
    await token.deployed();
    tokenContractAddress = await token.address;
  });

  // test address of the tokenFactory
  it("Should have an address", async () => {
    assert.notEqual(tokenContractAddress, null);
    assert.notEqual(tokenContractAddress, "");
    assert.notEqual(tokenContractAddress, 0x0);
    assert.notEqual(tokenContractAddress, undefined);
  });
  // test name of the token
  it("Should have a name", async () => {
    //returns name of the token

    const name = await token.collectionName();
    assert.equal(name, "JOHN");
  });

  //test symbol of the token
  it("Should have a symbol", async () => {
    //returns symbol of the token
    const symbol = await token.collectionSymbol();
    assert.equal(symbol, "JOHNCOIN");
  });

  //test if the contract can mint
  it("Should be able to mint token", async function () {
    // Mint token
    let txn = await token.mintToken();
    let tx = await txn.wait();

    //assign token ID of the minted token
    let event = tx.events[0];
    let value = event.args[2];
    tokenId = value.toNumber();

    assert.equal(tokenId, 0);
  });
});
