import { ethereum, TypedMap, Bytes, ByteArray } from "@graphprotocol/graph-ts";

const SELECTOR_SIZE = 4;

function toBytes(data: Uint8Array): Bytes {
  return Bytes.fromUint8Array(data);
}

class Decoder {
  constructor(public paramIndex: i32) {}

  getName(data: Bytes): string {
    let dataWithoutSelector = toBytes(data.slice(SELECTOR_SIZE));
    let paramPointer: i32 = this.paramIndex * 32;

    // get the param offset
    let paramOffset: i32 = ethereum
      .decode("uint256", toBytes(dataWithoutSelector.slice(paramPointer)))!
      .toBigInt()
      .toI32();

    // get the param length
    let paramLength: i32 = ethereum
      .decode("uint256", toBytes(dataWithoutSelector.slice(paramOffset)))!
      .toBigInt()
      .toI32();

    // move past the length
    paramOffset += 32;
    let nameHexString = toBytes(
      dataWithoutSelector.subarray(paramOffset, paramOffset + paramLength)
    ).toHex();
    let nameBytes = ByteArray.fromHexString(nameHexString);
    let name = nameBytes.toString();

    return name;
  }
}

// look up table for parsing transaction function data
export const decoders = new TypedMap<string, Decoder>();

/* function finalizeInstance(string name,address[],uint256) */
decoders.set("0x350cbe71", new Decoder(0));

// function newTokenAndInstance(string,string,string name,address[],uint64[3],uint64,bool))
decoders.set("0x8a29ac04", new Decoder(2));

// function newTokenAndInstance(string,string,string name,address[],uint256[],uint64[3],uint64,bool)
decoders.set("0x885b48e7", new Decoder(2));

// function newInstance(string name,address[],uint256[],uint64[3],uint64,bool)
decoders.set("0x0eb8e519", new Decoder(0));

// function newInstance(string name,address[],uint256)
decoders.set("0xa0fd20de", new Decoder(0));
