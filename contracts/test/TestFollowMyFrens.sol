pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FollowMyFrens.sol";

contract TestFollowMyFrens {

  function testInitialBalanceUsingDeployedContract() public {
    FollowMyFrens fmf = FollowMyFrens(DeployedAddresses.FollowMyFrens());

    uint expected = "0x000000000000000000000000000000000000dEaD";

    Assert.equal(fmf.createFren("0x000000000000000000000000000000000000dEaD"), expected, "Expected 0x000000000000000000000000000000000000dEaD");
  }

}
