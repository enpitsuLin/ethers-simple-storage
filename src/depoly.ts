import { type SimpleStorage } from '../types/ethers-contracts'
import { ethers } from 'ethers'
import fs from 'node:fs';

import 'dotenv/config'

// already deploy to 0xEb4971ee2C1f1B813ce3bF98215A9fF94339aB2f
async function main() {
  const abi = fs.readFileSync("./contracts/SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync("./contracts/SimpleStorage.bin", "utf-8");

  const provider = new ethers.JsonRpcProvider(
    process.env.ALCHEMY_RPC_URL
  )
  const wallet = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY!, provider)
  const contractFactory = new ethers.ContractFactory<any[], SimpleStorage>(abi, binary, wallet)

  console.log("Deploying contract, please wait...")
  const contract = await contractFactory.deploy()
  await contract.waitForDeployment()
  const address = contract.getAddress()
  console.log("Contract deployed at:", address)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)

  const transactionResponse = await contract.store("7")
  const transactionReceipt = await transactionResponse.wait(1)
  console.log("Transaction receipt:", transactionReceipt);

  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`)

}


main().catch(e => {
  console.error(e)
  process.exit(1)
})
