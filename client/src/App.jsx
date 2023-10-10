import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setSignature={setSignature}
      />
      <Transfer 
      setBalance={setBalance} 
         setAddress={setAddress}
      setPrivateKey={setPrivateKey}
       address={address} 
       signature={signature} />
    </div>
  );
}

export default App;
