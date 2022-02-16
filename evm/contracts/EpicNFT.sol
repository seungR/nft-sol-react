// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import {Base64} from "./libraries/Base64.sol";

import "hardhat/console.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol
import "@openzeppelin/contracts/utils/Strings.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol
import "@openzeppelin/contracts/utils/Counters.sol";

// We inherit the contract we imported so we can access its methods.
// ERC721 상속 받아서 메소드 접근, ERC721 : NFT 표준안
contract EpicNFT is ERC721URIStorage {
    // OpenZeppelin helpers that help keep track of tokenIds.
    // OpenZeppelin : Solidity 기반의 smart contract 를 개발하는 표준 프레임워크
    // using 라이브러리 for 기본 데이터를 쓰는 것으로 해당 데이터 타입에서 라이브러리 기능을 쓸 수 있음.
    using Counters for Counters.Counter;

    // Unique token ids.  Initilizes at 0.
    Counters.Counter private _tokenIds;
    uint256 max_tokens = 50;

    // Split the SVG at the part where it asks for the background color.
    string svgPartOne =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

    // I create three arrays, each with their own theme of random words.
    // Pick some random funny words, names of anime characters, foods you like, whatever!
    string[] firstWords = ["Squire", "Ser", "Sir", "Yeroner", "Milard", "Mylawd"];
    string[] secondWords = ["Tome", "Mutatis", "Mutandis", "Sui-Generis", "Ipso-Facto", "Ceteris-Paribus"];
    string[] thirdWords = ["Gavel", "Wig", "Robe", "Timesheet", "Briefs", "Docket"];

    // NewEpicNFTMinted 이벤트 생성
    event NewEpicNFTMinted(address sender, uint256 tokenId, uint256 maxTokens);

    // Pass the name of our NFT token and it's symbol.
    // NFT 의 토큰 이름과 Symbol 을 넘김
    constructor() ERC721("zpNFT", "z-nfty") {
        console.log("This is my NFT contract. Lordy!");
    }

    // app.js 에서 실행한 NFT 생성 Contract
    function makeEpicNFT() public {
        // Get the current tokenId. Starts at 0.
        uint256 newItemId = _tokenIds.current();

        // Ensure no more than 50 tokens.
        require(newItemId < 50);

        // Generate random words from lists
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        // Concat svg string with <text> and <svg> tags.
        string memory color = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, color, svgPartTwo, combinedWord, "</text></svg>"));

        // Marshall JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                // We set the title of our NFT as the generated word.
                combinedWord,
                '", "description": "A highly acclaimed collection of Legal NFTs.", "image": "data:image/svg+xml;base64,',
                // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                Base64.encode(bytes(finalSvg)),
                '"}'
            )
        );

        // Mint the NFT for the sender.
        // 안전하게 _toeknID(newItemId)를 생성하고 _to(msg.sender)에게 전달
        // https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721-_safeMint-address-uint256-
        _safeMint(msg.sender, newItemId);

        // Set the minted NFT's data.
        // 생성된 NFT 에 데이터 세팅
        string memory tokenData = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n--------------------");
        console.log(tokenData);
        console.log("--------------------\n");

        // https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage-_setTokenURI-uint256-string-
        // _tokenURI(tokenData)을 tokenID(newItemId)의 tokenURI에 세팅
        _setTokenURI(newItemId, tokenData);
        console.log("A NFT with id %d has been minted for sender %s", newItemId, msg.sender);

        // Increment token counter.
        _tokenIds.increment();
        console.log(
            "The Token's name is '%s' and its symbol is '%s'. Its URI data is %s. Total Supply is %s",
            name(),
            symbol(),
            tokenURI(newItemId)
        );

        emit NewEpicNFTMinted(msg.sender, newItemId, max_tokens);
    }

    // Helpers
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));

        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("RANDOM COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
