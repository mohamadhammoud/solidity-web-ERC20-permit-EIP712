import {ethers} from "ethers";
import ABIs from "../../config/ABIs/index";
import {Web3Provider} from "./Web3Provider";

class ERC20 {
    static balanceOf(contractAddress: string, ownerAddress: string) {
        const erc20Contract = new ethers.Contract(
            contractAddress,
            ABIs.ERC20_PERMIT,
            Web3Provider.getProvider()
        );

        const balance = erc20Contract.balanceOf(ownerAddress);

        return ethers.formatEther(balance.toString());
    }
}

export default ERC20;
