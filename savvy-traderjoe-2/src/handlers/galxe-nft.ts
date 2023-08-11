import { EventMinterAdded } from "../../generated/MMC_NFT/GalxeNFT";
import { getOrCreateAccount } from "../helpers/account";
import { syncAccountNFTPositions } from "../helpers/account-nft-positions";

export function handleMinterAdded(event: EventMinterAdded): void {
  const newMinter = getOrCreateAccount(event.params.newMinter);
  syncAccountNFTPositions(newMinter);
}