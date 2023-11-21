// import {signTypedData, SignTypedDataVersion} from "@metamask/eth-sig-util";

import {ethers} from "ethers";
import ERC20 from "../../utils/web3/ERC20";

const ERC20_name = async (contractAddress: string) => {
    return ERC20.tokenName(contractAddress);
};

const ERC20_balanceOf = async (contractAddress: string, ownerAddress: string) => {
    return ERC20.balanceOf(contractAddress, ownerAddress);
};

const ERC20_nonces = async (contractAddress: string, ownerAddress: string) => {
    return ERC20.nonces(contractAddress, ownerAddress);
};

async function ERC20_mint(
    signer: ethers.Signer,
    contractAddress: string,
    ownerAddress: string,
    amount: number
) {
    ERC20.mint(signer, contractAddress, ownerAddress, amount);
}

async function ERC20_transfer(
    signer: ethers.Signer,
    contractAddress: string,
    recipientAddress: string,
    amount: number
) {
    ERC20.transfer(signer, contractAddress, recipientAddress, amount);
}

async function ERC20_transferFrom(
    signer: ethers.Signer,
    contractAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    amount: number
) {
    ERC20.transferFrom(signer, contractAddress, ownerAddress, spenderAddress, amount);
}

async function ERC20_Sign_Permit(
    signer: ethers.Signer,
    contractAddress: string,
    spenderAddress: string,
    value: number,
    deadline: number
) {
    const PermitDefinition = [
        {name: "owner", type: "address"},
        {name: "spender", type: "address"},
        {name: "value", type: "uint256"},
        {name: "nonce", type: "uint256"},
        {name: "deadline", type: "uint256"}
    ];

    // const EIP712DomainDefinition = [
    //     {name: "name", type: "string"},
    //     {name: "version", type: "string"},
    //     {name: "chainId", type: "uint256"},
    //     {name: "verifyingContract", type: "address"}
    // ];

    const tokenDomainData = {
        name: await ERC20_name(contractAddress),
        version: "1",
        verifyingContract: contractAddress,
        chainId: Number((await signer.provider?.getNetwork())?.chainId)
    };

    const message = {
        owner: await signer.getAddress(),
        spender: spenderAddress,
        value: ethers.parseEther(value.toString()),
        nonce: await ERC20_nonces(contractAddress, await signer.getAddress()),
        deadline: deadline
    };

    const typedData = {
        types: {
            // EIP712Domain: EIP712DomainDefinition, no need for EIP712Domain definition
            Permit: PermitDefinition
        },
        domain: tokenDomainData,
        primaryType: "Permit",
        message: message
    };

    const signature = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message
    );

    const verifiedAddress = ethers.verifyTypedData(
        typedData.domain,
        typedData.types,
        typedData.message,
        signature
    );

    console.log({signature, verifiedAddress}, verifiedAddress === (await signer.getAddress()));

    const signerAddress = await signer.getAddress();

    // Split the signature into v, r, and s values
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = "0x" + signature.slice(130, 132);

    return {ownerAddress: signerAddress, spenderAddress, value, deadline, v, r, s};
}

async function ERC20_permit(
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
    ERC20.permit(signer, contractAddress, ownerAddress, spenderAddress, value, deadline, v, r, s);
}

export {
    ERC20_name,
    ERC20_balanceOf,
    ERC20_nonces,
    ERC20_mint,
    ERC20_transfer,
    ERC20_transferFrom,
    ERC20_Sign_Permit,
    ERC20_permit
};
