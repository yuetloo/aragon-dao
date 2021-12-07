import { ethereum, TypedMap, Bytes } from "@graphprotocol/graph-ts";

class Decoder {
  constructor(public nameIndex: i32, public types: string) {}

  getName(transactionInput: Bytes): string {
    let types = this.types || "";
    //let data = transactionInput.slice(4);
    //let dataInBytes = Bytes.fromUint8Array(data);
    let decoded = ethereum.decode(types, transactionInput);

    if (!decoded) {
      return "";
    }

    return decoded.toTuple()[this.nameIndex].toString();
  }
}

// look up table for parsing transaction function data
export const decoders = new TypedMap<string, Decoder>();

/* function finalizeInstance() */
decoders.set("0x350cbe71", new Decoder(0, "(string,address[],uint256)"));

// function newTokenAndInstance()
decoders.set(
  "0x8a29ac04",
  new Decoder(2, "(string,string,string,address[],uint64[3],uint64,bool)")
);

// function newTokenAndInstance()
decoders.set(
  "0x885b48e7",
  new Decoder(
    2,
    "(string,string,string,address[],uint256[],uint64[3],uint64,bool)"
  )
);

// function newInstance()
decoders.set(
  "0x0eb8e519",
  new Decoder(0, "(string,address[],uint256[],uint64[3],uint64,bool)")
);

// function newInstance()
decoders.set("0xa0fd20de", new Decoder(0, "(string,address[],uint256)"));
