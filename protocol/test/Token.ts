import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { signTypedData } from "../helpers/EIP712";
import { EIP712Domain, EIP712TypeDefinition } from "../helpers/EIP712.types";

describe("Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const NAME = "Mohamad's Token";
    const SYMBOL = "MHT";
    const VERSION = "1";
    const ONE_HOUR = 1 * 60 * 60;
    const BILLION_ETHER = ethers.parseEther("1000000000");

    // domain: EIP712Domain, types: EIP712TypeDefinition, values: Object, signer: HardhatSignerType

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("Token");
    const token = await TokenFactory.deploy(NAME, SYMBOL);

    const network = await ethers.provider.getNetwork();

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore?.timestamp;

    let deadline = 0;
    if (timestampBefore) {
      deadline = timestampBefore + ONE_HOUR;
    }

    const EIP712DomainDefinition = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];

    const PermitDefinition = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    const tokenDomainData: EIP712Domain = {
      name: await token.name(),
      version: "1",
      verifyingContract: await token.getAddress(),
      chainId: Number(network.chainId),
    };

    const message = {
      owner: await owner.getAddress(),
      spender: await otherAccount.getAddress(),
      value: BILLION_ETHER,
      nonce: await token.nonces(await owner.getAddress()),
      deadline: deadline,
    };

    const typedData = {
      types: {
        // EIP712Domain: EIP712DomainDefinition,
        Permit: PermitDefinition,
      },
      domain: tokenDomainData,
      primaryType: "Permit",
      message: message,
    };

    // const data = JSON.stringify(typedData);

    // const signature = await signTypedData(tokenDomainData, types);

    const signature = await owner.signTypedData(
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

    console.log(
      { signature, verifiedAddress },
      verifiedAddress === (await owner.getAddress())
    );

    // Split the signature into v, r, and s values
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = "0x" + signature.slice(130, 132);

    return {
      token,
      owner,
      otherAccount,
      BILLION_ETHER,
      message,
      signature,
      r,
      s,
      v,
    };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { owner, token, otherAccount, BILLION_ETHER, message, r, s, v } =
        await loadFixture(deployOneYearLockFixture);

      expect(await token.balanceOf(await owner.getAddress())).to.equal(
        BILLION_ETHER
      );

      await token
        .connect(otherAccount)
        .permit(
          await owner.getAddress(),
          await otherAccount.getAddress(),
          message.value,
          message.deadline,
          v,
          r,
          s
        );

      await token
        .connect(otherAccount)
        .transferFrom(
          await owner.getAddress(),
          await otherAccount.getAddress(),
          BILLION_ETHER
        );

      expect(await token.balanceOf(await owner.getAddress())).to.equal(0);
    });
  });
});
