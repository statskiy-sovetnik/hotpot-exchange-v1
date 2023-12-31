// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    uint256 public lastTokenId;

    constructor() ERC721("Test collection", "TST") {}

    function mint(address to) external {
        lastTokenId++;
        _mint(to, lastTokenId);
    }
}