해당 프로젝트는 원본 프로젝트를 연구해보기 위한 GIT 입니다.
[원본](https://github.com/zeuslawyer/nft-sol-react.git)

# Contract and# Contract and NFT details  

- 이 프로젝트는 오직 재미를 위한 것으로 프론트 엔드 DApp은 여기에 개재했음 [here](https://laughing-pike-52af82.netlify.app/).

- 해당 컨트랙트 주소 [rinkeby etherscan](https://rinkeby.etherscan.io/address/0x8839ffafbbe34a84ede832db33a1bcc708afba08) 는  0x03f6d53c4b337ee4d121db358baf33df8c71108c.

- 주조한 NFT는 여기서 볼 수 있음 [Rinkeby OpenSea](https://testnets.opensea.io/account), 여기는 테스트 넷으로 ERC721 token 들을 가지고 있음

![Goofy Legal NFTs](./opensea_screenshot.png)

# Stack

Hardhat, Solidity, JavaScript, [Alchemy](https://www.alchemy.com/) 이더리움 노드 API 진입점
- Hardhat : truffle과 비슷하게 ethereum 개발을 할 때 compile, depoly, test를 모두 진행할 수 있는 프레임워크
  둘 의 차이점은
  - Hardhat 은 Verify 의 자동화가 가능하다 
  - Hardhat 의 Typechain 플러그인을 통해 Typescript 를 지원
  - Solidity 에서 로그를 사용 가능 (이 점을 통해, dApp의 개발 진입장벽을 낮춤과 편의성 향상)

스마트 계약은 Rinkeby 네트워크에 배포함
- Rinkeby : Kovan 테스트넷과 같이 Ropsten 의 Spam attack 문제를 방지하고자 만들었음, Kovan의 PoA 알고리즘이 필요 이상으로 복잡하고 다른 이더리움 클라이언트 구현 및 포함 되는 것이 어렵다는 이유로 이더리움팀에서 자체적으로 제작한 알고리즘 적용
  - EVM(Ethereum Virtual Machine)에서 계약을 실행시키는 방식은 테스트넷에 큰 차이가 없음

리액트 프론트앤드는 Netlify에 배포
- Netlify : 서버와의 통신 없이 (API 로만 통신) 프론트앤드 스택으로만 구성된 애플리케이션을 배포하는 서비스

# Notes

실행 명령어는 루트 디렉토리가 아닌 관련 디렉토리에서 실행

메타마스크 브라우저 확장 기능 사용

Rinkeby 이더리움 테스트넷 사용

**ALWAYS REMEMBER...**
계약이 변경된 경우:

- 재배포(한번 배포된 계약은 수정 불가능).
- App.js에 계약 주소 업데이트
- 프론트의 `./abi` ABI 파일 업데이트
- `App.js`의 스마트 계약 주소 업데이트

# Compile smart contract and deploy to local Hardhat chain

**`evm` 디렉토리에서 아래 명령어 실행**

1. 루트 경로에서 `npx hardhat run scripts/<scriptname.js>` 실행, 이건 로컬 스크립트인지 확인하고 솔리디티를 컴파일하여 테스트 함

2. `npx hardhat run scripts/deploy.js --network rinkeby` 테스트넷에 배포하기 위함, 계약 주소를 가져와 `./dApp/src/App.js`의 'mintNFT()'에서 상수에 할당

3. 프런트 엔드가 최신 ABI를 사용하도록 새로 만든 `.evm/artifacts/contracts/EpicNFT.sol/EpicNFT.json` 파일을 `.dApp/src/configs`에 복사

# Useful Reference Docs

- [OpenZeppelin ERC721 contract implementation (Github)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

- [Metamask API - JSON-RPC methods](https://docs.metamask.io/guide/rpc-api.html#ethereum-json-rpc-methods)

- [ethers.js docs](https://docs.ethers.io/v5/api/signer/#signers)

# Useful tools

- [base64 encoding and decoding](https://www.utilities-online.info/base64)

- [rinkeby etherscan](https://rinkeby.etherscan.io/)

- [NFT previewer](https://nftpreview.0xdev.codes/)

- [ethereum JSON RPC methods + playground](https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/eth1.0-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=true&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false)
