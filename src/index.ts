import { ethers } from 'ethers'
import { SimpleStorage__factory } from '../types/ethers-contracts'

import 'dotenv/config'

async function main() {

  const provider = new ethers.JsonRpcProvider(
    process.env.ALCHEMY_RPC_URL
  )
  const wallet = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY!, provider)
  const contract = SimpleStorage__factory.connect('0xEb4971ee2C1f1B813ce3bF98215A9fF94339aB2f', wallet)

  const address = await contract.getAddress()
  console.log("Contract deployed at:", address)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)

  const transactionResponse = await contract.store("7")
  const transactionReceipt = await transactionResponse.wait(1)
  console.log("Transaction receipt:", transactionReceipt);

  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
