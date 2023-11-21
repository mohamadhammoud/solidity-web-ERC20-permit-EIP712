import { ethers } from "hardhat";

async function main() {
  const mohamadToken = await ethers.deployContract("Token", [
    "Mohamad's Token",
    "MHT",
  ]);

  await mohamadToken.waitForDeployment();

  console.log(
    ` ${mohamadToken} deployed to ${await mohamadToken.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
