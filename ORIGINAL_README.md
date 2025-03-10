# Contract and NFT details

- This is a fun project only. dApp Front end is published [here](https://laughing-pike-52af82.netlify.app/).

- The contract address on [rinkeby etherscan](https://rinkeby.etherscan.io/address/0x8839ffafbbe34a84ede832db33a1bcc708afba08) is 0x03f6d53c4b337ee4d121db358baf33df8c71108c.

- Minted NFTs can be seen on [Rinkeby OpenSea](https://testnets.opensea.io/account). They are goofy legal terminology ERC721 tokens.

![Goofy Legal NFTs](./opensea_screenshot.png)

# Stack

Hardhat, Solidity, JavaScript, [Alchemy](https://www.alchemy.com/) entrypoint to Ethereum node APIs.

Smart contract deployed on Rinkeby Network.

React frontend deployed on Netlify.

# Notes

Run commands in the relevant directory, not in project root.

Use the Metamask Wallet Browser Extension

Use the Ethereum Rinkeby testnet.

**ALWAYS REMEMBER...**
Any time the contract is changed:

- Redeploy.
- Update contract address in app.js.
- Update ABI file in the frontend's `./abi` folder.
- update the contract address constant in `app.js`

# Compile smart contract and deploy to local Hardhat chain

**Run the following commands from inside the `evm` directory.**

1. Run `npx hardhat run scripts/<scriptname.js>` from the project root. Ensure its the local script. This will test that the solidity compiles.

2. Run `npx hardhat run scripts/deploy.js --network rinkeby` to deploy to the testnet. Grab the contact address and assign it to the constant in `mintNFT()` in the ./dApp/src/app.js`.

3. copy the freshly made `./evm/artifacts/contracts/EpicNFT.sol/EpicNFT.json` file to `./dApp/src/configs` so that the front end uses the latest ABI.

# Useful Reference Docs

- [OpenZeppelin ERC721 contract implementation (Github)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

- [Metamask API - JSON-RPC methods](https://docs.metamask.io/guide/rpc-api.html#ethereum-json-rpc-methods)

- [ethers.js docs](https://docs.ethers.io/v5/api/signer/#signers)

# Useful tools

- [base64 encoding and decoding](https://www.utilities-online.info/base64)

- [rinkeby etherscan](https://rinkeby.etherscan.io/)

- [NFT previewer](https://nftpreview.0xdev.codes/)

- [ethereum JSON RPC methods + playground](https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/eth1.0-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=true&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false)
