// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract FrenList {
  uint public frenCount = 0;

  struct Fren {
    uint id;
    string content;
    bool notify;
	bool cancel;
  }

  mapping(uint => Fren) public frens;

  event FrenCreated(
    uint id,
    string content,
    bool notify,
	bool cancel
  );

  event FrenNotify(
    uint id,
    bool notify
  );

  event FrenCancel(
    uint id,
    bool cancel
  );

  constructor() public {

  }

  function createFren(string memory _content) public {
    frenCount ++;
    frens[frenCount] = Fren(frenCount, _content, false, false);
    emit FrenCreated(frenCount, _content, false, false);
  }

  function toggleNotify(uint _id) public {
    Fren memory _fren = frens[_id];
    _fren.notify = !_fren.notify;
    frens[_id] = _fren;
    emit FrenNotify(_id, _fren.notify);
  }

  function toggleCancel(uint _id) public {
    Fren memory _fren = frens[_id];
    _fren.cancel = !_fren.cancel;
    frens[_id] = _fren;
    emit FrenCancel(_id, _fren.cancel);
  }

}
