import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.8.20" }],
  },
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: process.env.ALCHEMY_PROVIDER,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
