# Direct Benefit Transfer on Blockchain
Bhamashah is an initiative of Rajasthan Government which enables smooth disbursal of benefits to the needy. Our solution utilizeses the properties of Blockchain to remove all the inefficiencies in the system. We have introduced a custom coin, RAJCoin, which will be used to issue, redeem, and exchange benefits taking fiat currency out of circulation. It leaves no room for corruption. RAJCoin will ensure that the benefits reach the intended person only.

## How does it work?
Asset required for direct benefit transfer is digitized using crypto-tokens to denote the ownership of the bearer and link its transfer between participants(retailer, farmer) on blockchain with the
movement of the physical asset, establishing a clear chain of provenance. 

This process is illustrated in the architecture diagram below.

## Why Blockchain
The current system of direct benefit transfer has several  issues involving delays, leakages ,corruption, dependency on presence of bank branches, complex banking procedure and documentations to be done, middlemen operating the end consumers bank accounts , misuse of subsidy by end-user etc. Using Direct Benefits Transfer System on blockchain provides delivery assurance and smooth disbursal of benefits to the needy
by enabling real-time tracking and visibility of payments. It also prevents losses owing either to corruption or to involvement of middlemen.  

## Technology used
Our system consists of a smart contract and pair of applications, for the use of Government, the Retailer, and the farmer.

The contract can be found in contracts/FertToken.sol. We implemented the applications via Node JS. The main functionality of the application can be looked at contractfunctions/FertToken.js.
In order to communicate with the contract, the module web3.js is used in these applications. A Node JS based Decentralized application was created on [Rinkeby testnet](https://www.rinkeby.io/#stats). 

## Who to contact
[Anurag Srivastava](mailto:anurag@zeonlab.com)

## Live Demo
You can find a live demo [here](http://bharatcoin.zeonlab.com/) 
