import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress, tokenCollateralAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const depositCollateralAndMintButton = document.getElementById("depositCollateralAndMintButton")
const mintButton = document.getElementById("mintButton")
const redeemButton = document.getElementById("redeemButton")
const redeemForDscButton = document.getElementById("redeemForDscButton")
const burnButton = document.getElementById("burnButton")
const liquidateButton = document.getElementById("liquidateButton")

connectButton.onclick = connect
depositCollateralAndMintButton.onclick = depositCollateralAndMintDsc
mintButton.onclick = mintDsc
redeemButton.onclick = redeemCollateral
redeemForDscButton.onclick = redeemCollateralForDsc
burnButton.onclick = burnDsc
liquidateButton.onclick = liquidatePosition

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function depositCollateralAndMintDsc() {
  const collateralAmount = document.getElementById("collateralAmount").value
  const dscAmount = document.getElementById("dscAmount").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    
    // First approve the contract to spend the tokens
    const erc20Abi = ["function approve(address spender, uint256 amount) public returns (bool)"]
    const tokenContract = new ethers.Contract(tokenCollateralAddress, erc20Abi, signer)
    const approvalTx = await tokenContract.approve(
      contractAddress,
      ethers.parseUnits(collateralAmount, 18),{
        gasLimit: 1000000 // Set a gas limit for the transaction
      }
    )
    console.log("Approving tokens...")
    await approvalTx.wait(1)
    console.log("Approval successful")
    
    // Then deposit and mint
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.depositCollateralAndMintDsc(
      tokenCollateralAddress,
      ethers.parseUnits(collateralAmount, 18),
      ethers.parseUnits(dscAmount, 18),{
        gasLimit: 1000000 // Set a gas limit for the transaction
      }
    )
    await txResponse.wait(1)
    console.log("Deposit & Mint: Success")
  } catch (error) {
    console.log(error)
  }
}

async function mintDsc() {
  const mintedDsc = document.getElementById("mintedDsc").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.mintDsc(ethers.parseUnits(mintedDsc, 18), {
      gasLimit: 1000000 // Set a gas limit for the transaction
    })
    await txResponse.wait(1)
    console.log("Mint DSC: Success")
  } catch (error) {
    console.log(error)
  }
}

async function redeemCollateral() {
  const redeemAmount = document.getElementById("redeemAmount").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.redeemCollateral(
      tokenCollateralAddress,
      ethers.parseUnits(redeemAmount, 18),{
        gasLimit: 1000000 // Set a gas limit for the transaction
      }
    )
    await txResponse.wait(1)
    console.log("Redeem Collateral: Success")
  } catch (error) {
    console.log(error)
  }
}

async function redeemCollateralForDsc() {
  const collateralAmt = document.getElementById("redeemForDscCollateralAmount").value
  const burnAmt = document.getElementById("redeemForDscBurnAmount").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.redeemCollateralForDsc(
      tokenCollateralAddress,
      ethers.parseUnits(collateralAmt, 18),
      ethers.parseUnits(burnAmt, 18),{
        gasLimit: 1000000 // Set a gas limit for the transaction
      }
    )
    await txResponse.wait(1)
    console.log("Redeem Collateral For DSC: Success")
  } catch (error) {
    console.log(error)
  }
}

async function burnDsc() {
  const burnedDsc = document.getElementById("burnedDsc").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.burnDsc(ethers.parseUnits(burnedDsc, 18), {
      gasLimit: 1000000 // Set a gas limit for the transaction
    })
    await txResponse.wait(1)
    console.log("Burn DSC: Success")
  } catch (error) {
    console.log(error)
  }
}

async function liquidatePosition() {
  const collateralToken = document.getElementById("liquidateCollateral").value
  const userAddress = document.getElementById("liquidateUser").value
  const debtToCover = document.getElementById("liquidateDebt").value
  if (!window.ethereum) return
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const txResponse = await contract.liquidate(
      collateralToken,
      userAddress,
      ethers.parseUnits(debtToCover, 18), {
        gasLimit: 1000000 // Set a gas limit for the transaction
      }
    )
    await txResponse.wait(1)
    console.log("Liquidation: Success")
  } catch (error) {
    console.log(error)
  }
}