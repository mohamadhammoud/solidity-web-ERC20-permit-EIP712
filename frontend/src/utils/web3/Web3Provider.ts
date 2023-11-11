import {ethers} from "ethers";

class Web3Provider {
    private static publicProvider: ethers.AlchemyProvider;

    static getProvider = (): ethers.AlchemyProvider => {
        if (Web3Provider.publicProvider == null) {
            try {
                Web3Provider.publicProvider = new ethers.AlchemyProvider(
                    process.env.ALCHEMY_PROVIDER
                );
            } catch (error) {
                // HERE: Error message
            }
        }
        return Web3Provider.publicProvider;
    };
}

export {Web3Provider};
