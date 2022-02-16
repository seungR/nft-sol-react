import "./styles/App.css";

import { ethers } from "ethers";
import epicNFT from "./abi/EpicNFT.json";

import React from "react";

// Constants
const OPENSEA_LINK = "https://testnets.opensea.io/assets";
const CONTRACT_ADDRESS = "0x8839FfaFbBE34A84EDe832db33A1BCC708afBa08";
const NETWORK_ID = "0x3"; // Ropsten 네트워크의 Chain Id

const App = () => {
  const [currentUserAccount, setCurrentUserAccount] = React.useState("");
  const [totalTokensMinted, setTotalTokensMinted] = React.useState(0);
  const [maxTokenSupply, setMaxTokenSupply] = React.useState(50);

  /**
   * @param {string} chainId
   * @desc 현재 네트워크의 ChainId의 16진수 코드가 NETWORK_ID와 같은지 체크
   * @return {boolean} 체크 결과 값
   */
  async function confirmNetwork(ethereum, chainId) {
    // RPC 호출
    let returnedChainId = await ethereum.request({method: "eth_chainId"});
    console.log("Connected to chain " + chainId);
    return returnedChainId !== NETWORK_ID ? false : true;
  }

  /**
   * @desc 메타마스크와 연결 되었는지
   * @return {boolean} 체크 결과 값
   */
  async function checkWalletConnected() {
    // 메타마스크 설치시 window.ethereum 객체가 있음
    const {ethereum} = window;
    if (!ethereum) {
      alert("Please login to Metamask!");
    }
    if (!confirmNetwork(ethereum, NETWORK_ID)) {
      alert("You are not connected to the Ropsten Test Network!");
      return;
    }

    // RPC 호출
    // RPC : https://docs.metamask.io/guide/rpc-api.html#table-of-contents
    // MetaMask Docs (rpc-api) : https://docs.metamask.io/guide/rpc-api.html#table-of-contents
    // eth_accoutns : https://eth.wiki/json-rpc/API#eth_accounts, Returns a list of addresses owned by client.
    // eth_accoutns 허가가 있어야지 eth_accoutns 를 요청할 수 있음
    const accounts = await ethereum.request({method: "eth_accounts"});
    if (accounts.length !== 0) {
      // 유저가 소유 지갑이 있을 경우, currentUserAccount 저장 및
      setCurrentUserAccount(accounts[0]);
      setupNFTMintedListener();
    } else {
      console.warn("No authorized account found");
    }
  }

  React.useEffect(() => {
    checkWalletConnected();
  });

  /**
   * @desc 메타마스크 지갑 연결(로그인)
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please login to Metamask!");
        return;
      }

      let ok = confirmNetwork(ethereum, NETWORK_ID);
      if (ok) {
        // Request accounts on wallet connect
        // eth_requestAccounts : 사용자가 식별 가능한 이더리움 주소를 제공하도록 요청, MetaMask 팝업 재생
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected! Account is: ", accounts[0]);
        setCurrentUserAccount(accounts[0]);
        setupNFTMintedListener();
      } else {
        alert("You are not connected to the Ropsten Test Network!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * @desc NFT 생성시 실행할 리스너 등록
   */
  const setupNFTMintedListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // Same stuff again
        // https://docs.ethers.io/v5/api/providers/
        // provider : 쿼리를 보내거나 서명된 변경 상태 트랜잭션을 보내기 위해 이더리움 블록체인 연결을 추상화해줌
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // Contract : 블록체인에 배포된 코드의 추상화
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          epicNFT.abi,
          signer
        );

        // https://docs.ethers.io/v5/api/contract/contract/#Contract--events
        // Listen to event
        // Solidity 이벤트 실행시 리스너 작동
        connectedContract.on(
          "NewEpicNFTMinted",
          (sender, tokenId, maxTokens) => {
            const openseaLink = `${OPENSEA_LINK}/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
            console.log(
              sender,
              tokenId.toNumber(),
              maxTokens.toNumber(),
              "--viewable at: ",
              openseaLink
            );
            setTotalTokensMinted(tokenId.toNumber());
            setMaxTokenSupply(maxTokens.toNumber());
            alert(
              `Hey there! Your NFT has been minted and linked it to your wallet address. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: ${openseaLink}`
            );
          }
        );

        console.log("event listener set up!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @desc NFT 생성
   */
  const mintNFT = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // 프로바이더 생성 및 계약 생성

        // Providers talk to ethereum nodes via a consistent interface to
        // standard Ethereum node functionality.
        // In my case, the provider will be from MetaMask, using metamask's nodes.
        const provider = new ethers.providers.Web3Provider(ethereum);

        // A Signer in ethers is an abstraction of an Ethereum Account,
        // which can be used to sign messages and transactions and send
        // signed transactions to the Ethereum Network to execute state changing operations.
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          epicNFT.abi,
          signer
        );

        // EpicNFT.sol 의 makeEpicNFT 계약 실행
        let nftTx = await connectedContract.makeEpicNFT();
        await nftTx.wait();
        console.log(
          `Mined, see transaction: https://Ropsten.etherscan.io/tx/${nftTx.hash}`
        );
      } else {
        console.error("ethereum object not found");
      }
    } catch (e) {
      console.error("error in mintNFT :", e);
    }
  };

  const disconnectWallet = async () => {
    setCurrentUserAccount("");
  };

  // Render Methods : 뷰를 위한 랜더링 메소드들
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={() => {
        connectWallet();
      }}
    >
      Connect Your Wallet
    </button>
  );

  const renderMintNFTButton = () => (
    <button className="cta-button connect-wallet-button" onClick={mintNFT}>
      MINT NFT
    </button>
  );

  const renderLogout = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={disconnectWallet}
    >
      Disconnect Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT 컬랙션</p>
          <p className="sub-text">
            Tongue-in-Cheek Lawyer Tokens. Discover your NFT today.
          </p>
          {currentUserAccount
            ? renderMintNFTButton()
            : renderNotConnectedContainer()}
          {currentUserAccount ? renderLogout() : null}
        </div>
        <div className="header-container">
          <p className="sub-text">
            {totalTokensMinted
              ? `${totalTokensMinted} / ${maxTokenSupply} minted.`
              : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
