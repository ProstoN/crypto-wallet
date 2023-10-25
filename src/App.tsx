import React from 'react';
import './App.css';
import Wallet from "./wallet/wallet";

declare global {
    interface Window {
        ethereum: any;
        web3: any
    }
}

function App() {
    return (
        <div className="App">
            <Wallet/>
        </div>
    );
}

export default App;