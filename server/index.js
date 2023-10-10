const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const port = 3042;
const hashfunc = require("./hashMessage");
app.use(cors());
app.use(express.json());

const balances = {
  "02b7fc4aa660de43a3f24c0afeb08c9ebfaae713bbfcf8b7f9424f96c6f77fef44": 100,
  "0393acd4cde59543efab266e06dbe8060275435721419acf53877f3164ef68bb63": 50,
  "02f3b55b3b5216e64aacdc3cb575a50444e4de64aff5b32e4a87ef5a1100bac33c": 75,
};
const randomMsgHashes = {};

//creates the hash and assigns it to the address, we recieved from the client, then we send the hasmessage to the client
app.get("/randomMsg/:address", (req, res) => {
  const { address } = req.params;
  const messageHash = setRandomMsg(address);
  res.send({ messageHash });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, sender, recipient, amount } = req.body;
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);
  if (!randomMsgHashes[sender]) res.status(400).send({ message: "Ha ha i caught you, going through the back door😂😂🤣" });
  const isValid = secp.secp256k1.verify(signature, randomMsgHashes[sender], sender) === true;

  if (!isValid) res.status(400).send({ message: "Bad signature!" });

  setInitialBalance(sender);
  setInitialBalance(recipient);
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ msg: "Transfer made successfully🥂" });
  }
  //we delete the hash array after te whole transaction,incase of reintrancy attack
  if (randomMsgHashes.hasOwnProperty(sender)) {
    delete randomMsgHashes[sender];
    // console.log(`Deleted key: ${sender}`);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function setRandomMsg(address) {
  const message = address + Date.now();
  const hashmsg = hashfunc(message);
  randomMsgHashes[address] = hashmsg;
  return randomMsgHashes[address];
}

/**
 * private address ---> public
 * 694b972dab24b0b851c18abb45b12933efafea0f158e5821451de0bccea577c3 --->  02b7fc4aa660de43a3f24c0afeb08c9ebfaae713bbfcf8b7f9424f96c6f77fef44
 * 662af18838ff9955f309e0855cd53a5cbf031c4a0b92726ced322132bf82102c --->  0393acd4cde59543efab266e06dbe8060275435721419acf53877f3164ef68bb63
 * 8bdbfa125155d6deaaad1dbe6e1c926010d3c2a71c40dd9cc48a97e3590f93f8 ---> 02f3b55b3b5216e64aacdc3cb575a50444e4de64aff5b32e4a87ef5a1100bac33c
 */