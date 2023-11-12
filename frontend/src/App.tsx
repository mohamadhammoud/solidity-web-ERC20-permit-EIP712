import {useState} from "react";
import "./App.css";
import {Signer, ethers} from "ethers";
import {ERC20_balanceOf} from "./actions/web3/web3.actions";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum?: any;
    }
}

function App() {
    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");
    const [userBalance, setUserBalance] = useState(0);

    const connectwalletHandler = async () => {
        if (window?.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            // It will prompt user for account connections if it isnt connected
            const signer = await provider.getSigner();

            await accountChangedHandler(signer);
        } else {
            setErrorMessage("Please Install Metamask!!!");
        }
    };

    const accountChangedHandler = async (newAccount: Signer) => {
        const address = await newAccount.getAddress();
        console.log(address);
        setDefaultAccount(address);

        const balance = await ERC20_balanceOf(
            process.env.REACT_APP_ERC20_TOKEN_ADDRESS ?? "",
            address
        );

        setUserBalance(Number(balance));
    };

    return (
        <div className="App">
            <h4>{errorMessage}</h4>
            <h4 className="">{defaultAccount}</h4>
            <h4 className="">{userBalance}</h4>

            <button style={{background: "white"}} onClick={connectwalletHandler}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </button>
        </div>
    );
}

export default App;
