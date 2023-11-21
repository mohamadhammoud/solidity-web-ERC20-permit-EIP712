import {useState} from "react";
import "./App.css";
import {Signer, ethers} from "ethers";
import {
    ERC20_Sign_Permit,
    ERC20_balanceOf,
    ERC20_permit,
    ERC20_transferFrom
} from "./actions/web3/web3.actions";

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
    const [signer, setSigner] = useState();

    const [ownerAddress, setOwnerAddress] = useState("");
    const [spenderAddress, setSpenderAddress] = useState("");
    const [value, setValue] = useState(0);
    const [deadline, setDeadline] = useState(0);
    const [v, setV] = useState("");
    const [r, setR] = useState("");
    const [s, setS] = useState("");

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

        setSigner(signer);
    };

    const onSignPermit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const provider = new ethers.BrowserProvider(window.ethereum);
        // It will prompt user for account connections if it isnt connected
        const signer = await provider.getSigner();

        console.log("Who is signing ?", {
            signer,
            x: process.env.REACT_APP_ERC20_TOKEN_ADDRESS ?? "",
            spenderAddress,
            value,
            deadline
        });
        const response = await ERC20_Sign_Permit(
            signer,
            process.env.REACT_APP_ERC20_TOKEN_ADDRESS ?? "",
            spenderAddress,
            value,
            deadline
        );

        console.log(response);
    };

    const onPermit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const provider = new ethers.BrowserProvider(window.ethereum);
        // It will prompt user for account connections if it isnt connected
        const signer = await provider.getSigner();

        const response = await ERC20_permit(
            signer,
            process.env.REACT_APP_ERC20_TOKEN_ADDRESS ?? "",
            ownerAddress,
            spenderAddress,
            value,
            deadline,
            v,
            r,
            s
        );

        console.log(response);
    };

    // Handle form submission
    const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const provider = new ethers.BrowserProvider(window.ethereum);
        // It will prompt user for account connections if it isnt connected
        const signer = await provider.getSigner();

        try {
            await ERC20_transferFrom(
                signer,
                process.env.REACT_APP_ERC20_TOKEN_ADDRESS ?? "",
                ownerAddress,
                spenderAddress,
                value
            );
            console.log("TransferFrom executed successfully");
        } catch (error) {
            console.error("Error executing TransferFrom:", error);
        }
    };

    return (
        <div className="App">
            <h4> errorMessage {errorMessage}</h4>
            <h4> defaultAccount {defaultAccount}</h4>
            <h4> userBalance {userBalance}</h4>
            <h4>spenderAddress {spenderAddress}</h4>
            <h4>value {value}</h4>
            <h4>deadline {deadline}</h4>
            <h4>v {v}</h4>
            <h4>r {r}</h4>
            <h4>s {s}</h4>

            <button style={{background: "white"}} onClick={connectwalletHandler}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </button>

            <div>
                <h1>Sign Permit</h1>
                <form onSubmit={onSignPermit}>
                    <label>
                        Spender Address:
                        <input
                            type="text"
                            value={spenderAddress}
                            onChange={(e) => setSpenderAddress(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Value:
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <label>
                        Deadline:
                        <input
                            type="number"
                            value={deadline}
                            onChange={(e) => setDeadline(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <button type="submit">Sign Permit</button>
                </form>

                <h1>Permit</h1>
                <form onSubmit={onPermit}>
                    {/* Use the same state variables for spenderAddress, value, and deadline */}
                    <label>
                        Owner Address:
                        <input
                            type="text"
                            value={ownerAddress}
                            onChange={(e) => setOwnerAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        Spender Address:
                        <input
                            type="text"
                            value={spenderAddress}
                            onChange={(e) => setSpenderAddress(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Value:
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <label>
                        Deadline:
                        <input
                            type="number"
                            value={deadline}
                            onChange={(e) => setDeadline(Number(e.target.value))}
                        />
                    </label>
                    <br />

                    {/* Fields for v, r, and s */}
                    <label>
                        V:
                        <input type="text" value={v} onChange={(e) => setV(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        R:
                        <input type="text" value={r} onChange={(e) => setR(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        S:
                        <input type="text" value={s} onChange={(e) => setS(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Permit</button>
                </form>
                <br />

                <form onSubmit={handleTransfer}>
                    <h1>Transfer From</h1>
                    <label>
                        Owner Address:
                        <input
                            type="text"
                            value={ownerAddress}
                            onChange={(e) => setOwnerAddress(e.target.value)}
                        />
                    </label>
                    <br />

                    <label>
                        Spender Address:
                        <input
                            type="text"
                            value={spenderAddress}
                            onChange={(e) => setSpenderAddress(e.target.value)}
                        />
                    </label>
                    <br />

                    <label>
                        Amount:
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </label>
                    <br />

                    <button type="submit">Transfer From</button>
                </form>
            </div>
        </div>
    );
}

export default App;
