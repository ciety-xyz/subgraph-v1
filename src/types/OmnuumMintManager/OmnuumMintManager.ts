// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Airdrop extends ethereum.Event {
  get params(): Airdrop__Params {
    return new Airdrop__Params(this);
  }
}

export class Airdrop__Params {
  _event: Airdrop;

  constructor(event: Airdrop) {
    this._event = event;
  }

  get nftContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get receiver(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get quantity(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ChangeFeeRate extends ethereum.Event {
  get params(): ChangeFeeRate__Params {
    return new ChangeFeeRate__Params(this);
  }
}

export class ChangeFeeRate__Params {
  _event: ChangeFeeRate;

  constructor(event: ChangeFeeRate) {
    this._event = event;
  }

  get feeRate(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PublicMint extends ethereum.Event {
  get params(): PublicMint__Params {
    return new PublicMint__Params(this);
  }
}

export class PublicMint__Params {
  _event: PublicMint;

  constructor(event: PublicMint) {
    this._event = event;
  }

  get nftContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get minter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get groupId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get maxQuantity(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class SetMinFee extends ethereum.Event {
  get params(): SetMinFee__Params {
    return new SetMinFee__Params(this);
  }
}

export class SetMinFee__Params {
  _event: SetMinFee;

  constructor(event: SetMinFee) {
    this._event = event;
  }

  get minFee(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class SetPublicSchedule extends ethereum.Event {
  get params(): SetPublicSchedule__Params {
    return new SetPublicSchedule__Params(this);
  }
}

export class SetPublicSchedule__Params {
  _event: SetPublicSchedule;

  constructor(event: SetPublicSchedule) {
    this._event = event;
  }

  get nftContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get groupId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get endDate(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get basePrice(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get supply(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get maxMintAtAddress(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class SetSpecialFeeRate extends ethereum.Event {
  get params(): SetSpecialFeeRate__Params {
    return new SetSpecialFeeRate__Params(this);
  }
}

export class SetSpecialFeeRate__Params {
  _event: SetSpecialFeeRate;

  constructor(event: SetSpecialFeeRate) {
    this._event = event;
  }

  get nftContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get discountFeeRate(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class OmnuumMintManager__publicMintSchedulesResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }
}

export class OmnuumMintManager extends ethereum.SmartContract {
  static bind(address: Address): OmnuumMintManager {
    return new OmnuumMintManager("OmnuumMintManager", address);
  }

  feeRate(): BigInt {
    let result = super.call("feeRate", "feeRate():(uint256)", []);

    return result[0].toBigInt();
  }

  try_feeRate(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("feeRate", "feeRate():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getFeeRate(_nftContract: Address): BigInt {
    let result = super.call("getFeeRate", "getFeeRate(address):(uint256)", [
      ethereum.Value.fromAddress(_nftContract)
    ]);

    return result[0].toBigInt();
  }

  try_getFeeRate(_nftContract: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getFeeRate", "getFeeRate(address):(uint256)", [
      ethereum.Value.fromAddress(_nftContract)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minFee(): BigInt {
    let result = super.call("minFee", "minFee():(uint256)", []);

    return result[0].toBigInt();
  }

  try_minFee(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("minFee", "minFee():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  publicMintSchedules(
    param0: Address,
    param1: BigInt
  ): OmnuumMintManager__publicMintSchedulesResult {
    let result = super.call(
      "publicMintSchedules",
      "publicMintSchedules(address,uint256):(uint32,uint32,uint32,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new OmnuumMintManager__publicMintSchedulesResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt()
    );
  }

  try_publicMintSchedules(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<OmnuumMintManager__publicMintSchedulesResult> {
    let result = super.tryCall(
      "publicMintSchedules",
      "publicMintSchedules(address,uint256):(uint32,uint32,uint32,uint256,uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new OmnuumMintManager__publicMintSchedulesResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt()
      )
    );
  }

  rateDecimal(): i32 {
    let result = super.call("rateDecimal", "rateDecimal():(uint8)", []);

    return result[0].toI32();
  }

  try_rateDecimal(): ethereum.CallResult<i32> {
    let result = super.tryCall("rateDecimal", "rateDecimal():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  specialFeeRates(param0: Address): BigInt {
    let result = super.call(
      "specialFeeRates",
      "specialFeeRates(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_specialFeeRates(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "specialFeeRates",
      "specialFeeRates(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ChangeFeeRateCall extends ethereum.Call {
  get inputs(): ChangeFeeRateCall__Inputs {
    return new ChangeFeeRateCall__Inputs(this);
  }

  get outputs(): ChangeFeeRateCall__Outputs {
    return new ChangeFeeRateCall__Outputs(this);
  }
}

export class ChangeFeeRateCall__Inputs {
  _call: ChangeFeeRateCall;

  constructor(call: ChangeFeeRateCall) {
    this._call = call;
  }

  get _newFeeRate(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ChangeFeeRateCall__Outputs {
  _call: ChangeFeeRateCall;

  constructor(call: ChangeFeeRateCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _feeRate(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class MintMultipleCall extends ethereum.Call {
  get inputs(): MintMultipleCall__Inputs {
    return new MintMultipleCall__Inputs(this);
  }

  get outputs(): MintMultipleCall__Outputs {
    return new MintMultipleCall__Outputs(this);
  }
}

export class MintMultipleCall__Inputs {
  _call: MintMultipleCall;

  constructor(call: MintMultipleCall) {
    this._call = call;
  }

  get _nftContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tos(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _quantitys(): Array<i32> {
    return this._call.inputValues[2].value.toI32Array();
  }
}

export class MintMultipleCall__Outputs {
  _call: MintMultipleCall;

  constructor(call: MintMultipleCall) {
    this._call = call;
  }
}

export class PreparePublicMintCall extends ethereum.Call {
  get inputs(): PreparePublicMintCall__Inputs {
    return new PreparePublicMintCall__Inputs(this);
  }

  get outputs(): PreparePublicMintCall__Outputs {
    return new PreparePublicMintCall__Outputs(this);
  }
}

export class PreparePublicMintCall__Inputs {
  _call: PreparePublicMintCall;

  constructor(call: PreparePublicMintCall) {
    this._call = call;
  }

  get _groupId(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _quantity(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _value(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _minter(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class PreparePublicMintCall__Outputs {
  _call: PreparePublicMintCall;

  constructor(call: PreparePublicMintCall) {
    this._call = call;
  }
}

export class SetMinFeeCall extends ethereum.Call {
  get inputs(): SetMinFeeCall__Inputs {
    return new SetMinFeeCall__Inputs(this);
  }

  get outputs(): SetMinFeeCall__Outputs {
    return new SetMinFeeCall__Outputs(this);
  }
}

export class SetMinFeeCall__Inputs {
  _call: SetMinFeeCall;

  constructor(call: SetMinFeeCall) {
    this._call = call;
  }

  get _minFee(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetMinFeeCall__Outputs {
  _call: SetMinFeeCall;

  constructor(call: SetMinFeeCall) {
    this._call = call;
  }
}

export class SetPublicMintScheduleCall extends ethereum.Call {
  get inputs(): SetPublicMintScheduleCall__Inputs {
    return new SetPublicMintScheduleCall__Inputs(this);
  }

  get outputs(): SetPublicMintScheduleCall__Outputs {
    return new SetPublicMintScheduleCall__Outputs(this);
  }
}

export class SetPublicMintScheduleCall__Inputs {
  _call: SetPublicMintScheduleCall;

  constructor(call: SetPublicMintScheduleCall) {
    this._call = call;
  }

  get _nft(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _groupId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _endDate(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _basePrice(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _supply(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _maxMintAtAddress(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class SetPublicMintScheduleCall__Outputs {
  _call: SetPublicMintScheduleCall;

  constructor(call: SetPublicMintScheduleCall) {
    this._call = call;
  }
}

export class SetSpecialFeeRateCall extends ethereum.Call {
  get inputs(): SetSpecialFeeRateCall__Inputs {
    return new SetSpecialFeeRateCall__Inputs(this);
  }

  get outputs(): SetSpecialFeeRateCall__Outputs {
    return new SetSpecialFeeRateCall__Outputs(this);
  }
}

export class SetSpecialFeeRateCall__Inputs {
  _call: SetSpecialFeeRateCall;

  constructor(call: SetSpecialFeeRateCall) {
    this._call = call;
  }

  get _nftContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _feeRate(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetSpecialFeeRateCall__Outputs {
  _call: SetSpecialFeeRateCall;

  constructor(call: SetSpecialFeeRateCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
