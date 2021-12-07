import { ClaimSubdomain as ClaimSubdomainEvent } from "../generated/FIFSResolvingRegistrar/FIFSResolvingRegistrar";
import { Domain } from "../generated/schema";
import { decoders } from "./Decoder";

export function handleClaimSubdomain(event: ClaimSubdomainEvent): void {
  let id = event.transaction.hash.toHex();
  let domain = new Domain(id);

  domain.subnode = event.params.subnode;
  domain.owner = event.params.owner;
  domain.resolver = event.params.resolver;
  domain.createdAt = event.block.timestamp;
  domain.blockNumber = event.block.number;
  domain.txInput = event.transaction.input;

  let inputHexString = event.transaction.input.toHex();
  let methodId = inputHexString.slice(0, 10);
  if (decoders.isSet(methodId)) {
    let decoder = decoders.get(methodId)!;
    domain.name = decoder.getName(event.transaction.input);
  }

  domain.save();
}
