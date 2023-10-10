import { useState } from "react";
import server from "./server";

function Transfer({ signature, setBalance, address, setPrivateKey, setAddress }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  // private key 694b972dab24b0b851c18abb45b12933efafea0f158e5821451de0bccea577c3
  // public key: 02b7fc4aa660de43a3f24c0afeb08c9ebfaae713bbfcf8b7f9424f96c6f77fef44

  // private key 662af18838ff9955f309e0855cd53a5cbf031c4a0b92726ced322132bf82102c
  // public key: 0393acd4cde59543efab266e06dbe8060275435721419acf53877f3164ef68bb63

  // private key 8bdbfa125155d6deaaad1dbe6e1c926010d3c2a71c40dd9cc48a97e3590f93f8
  // public key: 02f3b55b3b5216e64aacdc3cb575a50444e4de64aff5b32e4a87ef5a1100bac33c

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // we are converting the bigints to string so as to pass it as a data to our request
      signature.r = signature.r.toString();
      signature.s = signature.s.toString();
      const {
        data: { msg },
      } = await server.post(`send`, {
        sender: address,
        signature: signature,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(0);
      setAddress('');
      setPrivateKey('');
      alert(msg);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
