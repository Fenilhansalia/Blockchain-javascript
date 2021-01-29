const SHA256 = require("crypto-js/sha256");

//create a block
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

//create a blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // Creating first block
  createGenesisBlock() {
    return new Block(0, "29/01/2021", "Genesis block", "0");
  }

  //Fetching latest block in blockchain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let fentronCoin = new Blockchain();

fentronCoin.addBlock(new Block(1, "30/01/2021", { amount: 4 }));
fentronCoin.addBlock(new Block(2, "31/01/2021", { amount: 5 }));
fentronCoin.addBlock(new Block(3, "01/02/2021", { amount: 6 }));

//Verify Blockchain
console.log("Is blockchain valid? ", fentronCoin.isChainValid());

//console.log(JSON.stringify(fentronCoin, null, 4));

// tampering with the blockchain
fentronCoin.chain[1].data = { amount: 100 };
// Re-calculating hash after tampering
fentronCoin.chain[1].hash = fentronCoin.chain[1].calculateHash();

//Verify Blockchain
console.log(
  "Is blockchain valid after tampering data? ",
  fentronCoin.isChainValid()
);

//console.log(JSON.stringify(fentronCoin, null, 4));
