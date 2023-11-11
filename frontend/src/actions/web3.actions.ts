import ERC20 from "../utils/web3/ERC20";

const getERC20Balanceof = async (contractAddress: string, ownerAddress: string) => {
    return ERC20.balanceOf(contractAddress, ownerAddress);
};

export {getERC20Balanceof};
