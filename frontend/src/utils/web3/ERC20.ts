import {ethers} from "ethers";
import ABIs from "../../config/ABIs/index";
import {Web3Provider} from "./Web3Provider";

class ERC20 {
    static async tokenName(contractAddress: string) {
        const erc20Contract = new ethers.Contract(
            contractAddress,
            ABIs.ERC20_PERMIT,
            Web3Provider.getProvider()
        );

        return await erc20Contract.name();
    }

    static async balanceOf(contractAddress: string, ownerAddress: string) {
        const erc20Contract = new ethers.Contract(
            contractAddress,
            ABIs.ERC20_PERMIT,
            Web3Provider.getProvider()
        );

        const balance = await erc20Contract.balanceOf(ownerAddress);

        return ethers.formatEther(balance.toString());
    }

    static async nonces(contractAddress: string, ownerAddress: string) {
        const erc20Contract = new ethers.Contract(
            contractAddress,
            ABIs.ERC20_PERMIT,
            Web3Provider.getProvider()
        );

        return await erc20Contract.nonces(ownerAddress);
    }

    static async mint(
        signer: ethers.Signer,
        contractAddress: string,
        ownerAddress: string,
        amount: number
    ) {
        const erc20Contract = new ethers.Contract(contractAddress, ABIs.ERC20_PERMIT, signer);

        await erc20Contract.mint(ownerAddress, ethers.parseEther(amount.toString()));
    }

    static async transfer(
        signer: ethers.Signer,
        contractAddress: string,
        recipientAddress: string,
        amount: number
    ) {
        const erc20Contract = new ethers.Contract(contractAddress, ABIs.ERC20_PERMIT, signer);

        await erc20Contract.transfer(recipientAddress, ethers.parseEther(amount.toString()));
    }

    static async transferFrom(
        signer: ethers.Signer,
        contractAddress: string,
        ownerAddress: string,
        spenderAddress: string,
        amount: number
    ) {
        const erc20Contract = new ethers.Contract(contractAddress, ABIs.ERC20_PERMIT, signer);

        await erc20Contract.transferFrom(
            ownerAddress,
            spenderAddress,
            ethers.parseEther(amount.toString())
        );
    }

    static async permit(
        signer: ethers.Signer,
        contractAddress: string,
        ownerAddress: string,
        spenderAddress: string,
        value: number,
        deadline: number,
        v: string,
        r: string,
        s: string
    ) {
        const erc20Contract = new ethers.Contract(contractAddress, ABIs.ERC20_PERMIT, signer);

        await erc20Contract.permit(
            ownerAddress,
            spenderAddress,
            ethers.parseEther(value.toString()),
            deadline,
            v,
            r,
            s
        );
    }
}

export default ERC20;
