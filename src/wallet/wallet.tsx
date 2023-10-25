import React, { useEffect, useState, MouseEventHandler } from 'react';
import Web3 from 'web3';

import MetaMaskFox from '../icons/MetaMask_Fox.svg';
import Copy from '../icons/copy.svg';
import { BSC_RPC, USDT_ABI, USDT_ADDRESS } from "../utils";

interface IconProps {
    size?: number;
    onClick?: MouseEventHandler;
}

const MetaMaskIcon: React.FC<IconProps> = ({ size = 100 }) => (
    <div className="metamask-icon" style={{ width: size, height: size }}>
        <img src={MetaMaskFox} alt="MetaMask" className="metamask-fox"/>
        <span className="metamask-text">MetaMask</span>
    </div>
);

const CopyIcon: React.FC<IconProps> = ({ size = 100, onClick }) => (
    <div className="copy-container" style={{ width: size, height: size }} onClick={onClick}>
        <img src={Copy} alt="Copy" className="copy-icon"/>
    </div>
);

const Wallet: React.FC = () => {
    const [account, setAccount] = useState(localStorage.getItem('connectedWallet') || '');
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const provider = new Web3.providers.HttpProvider(BSC_RPC);
        window.web3 = new Web3(provider);
    }, []);

    useEffect(() => {
        getUsdtBalance();
    }, [account]);

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        localStorage.setItem('connectedWallet', accounts[0]);
    };

    const disconnectWallet = () => {
        setAccount('');
        setUsdtBalance(0);
        localStorage.removeItem('connectedWallet');
    };

    const shortenAccount = (account: string) => {
        if (!account) return '';
        const start = account.slice(0, 6);
        const end = account.slice(-4);
        return `${start}...${end}`;
    };

    const getUsdtBalance = async () => {
        if (account && window.web3) {
            const web3 = window.web3;
            const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);
            let balance = await usdtContract.methods.balanceOf(account).call();
            balance = parseFloat(web3.utils.fromWei(balance, 'mwei')).toFixed(6);
            setUsdtBalance(balance);
        }
    };

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text);
            console.log('Text successfully copied to clipboard');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="container">
            <div>
                <MetaMaskIcon size={200} />
                {account === '' ?
                    <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
                    : <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>}
            </div>
            <div>
                {account && (
                    <>
                        <p className="connected-account-text">
                            Account: {shortenAccount(account)}
                            <CopyIcon onClick={() => copyToClipboard(account)} size={24} />
                            <div className={`toast ${copied ? 'show' : ''}`}>Скопировано!</div>
                        </p>
                        <p className="balance-text">
                            Balance: <span className="balance-amount">${usdtBalance} USDT</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wallet;
