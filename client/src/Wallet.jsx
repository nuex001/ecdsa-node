import server from "./server";
import { useEffect } from "react";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, setSignature }) {
  async function onChange(evt) {
    const regexPattern = /^(0x)?[0-9A-Fa-f]{64}$/; //This pattern allows for both "0x" prefixed and unprefixed hexadecimal strings, and it ensures that the string is exactly 64 characters long (32 bytes).
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    // because the privateKey inputs keeps having issues, when typing it in, i had to use regex first before we get the publickey
    if (regexPattern.test(privateKey)) {
      const publicKey = secp.secp256k1.getPublicKey(privateKey);
      setAddress(toHex(publicKey));  //converts to the hex format and updates the address state
    } else {
      setAddress("");
    }
  }
  async function addrFunc() {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      // had this function to request for a has on the server,which the server saves and send it back here which i use for the signature and update the signature state
      const {
        data: { messageHash },
      } = await server.get(`randomMsg/${address}`);
      const signature = secp.secp256k1.sign(messageHash, privateKey);
      setSignature(signature); 
    } else {
      setBalance(0);
    }
  }
  useEffect(() => {
    addrFunc();
  }, [address])
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Please input your private keys
        <input placeholder="Type in your private key, for example: 046" value={privateKey} onChange={onChange}></input>
        <span>{address.slice(0, 5)}...{address.slice(-5)}</span>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
