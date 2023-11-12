import {ethers} from "ethers";

class Web3Provider {
    private static publicProvider: ethers.JsonRpcProvider;

    static getProvider = (): ethers.JsonRpcProvider => {
        if (Web3Provider.publicProvider == null) {
            try {
                Web3Provider.publicProvider = new ethers.JsonRpcProvider(
                    process.env.REACT_APP_ALCHEMY_PROVIDER
                );
            } catch (error) {
                // HERE: Error message
            }
        }
        return Web3Provider.publicProvider;
    };
}

export {Web3Provider};
