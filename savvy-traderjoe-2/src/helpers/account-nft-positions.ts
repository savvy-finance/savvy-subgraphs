import { Address } from "@graphprotocol/graph-ts";
import { Account, AccountNFTPositions } from "../../generated/schema";
import { BIGINT_ZERO, MMC_NFT, UNSHETH_NFT } from "../constants";

export function getOrCreateAccountNFTPositions(account: string): AccountNFTPositions {
  let accountNFTPositions = AccountNFTPositions.load(account);
  if (accountNFTPositions === null) {
    accountNFTPositions = new AccountNFTPositions(account);
    accountNFTPositions.hasEverHeldUnshETHNFT = false;
    accountNFTPositions.hasEverHeldMMCNFT = false;
    accountNFTPositions.save();
  }
  return accountNFTPositions as AccountNFTPositions;
}

export function syncAccountNFTPositions(account: Account): Account {
  const accountNFTPositions = getOrCreateAccountNFTPositions(account.id);
  accountNFTPositions.hasEverHeldMMCNFT = accountNFTPositions.hasEverHeldMMCNFT || MMC_NFT.minters(Address.fromString(account.id));
  accountNFTPositions.hasEverHeldUnshETHNFT = accountNFTPositions.hasEverHeldUnshETHNFT || UNSHETH_NFT.minters(Address.fromString(account.id));
  accountNFTPositions.save();
  
  account.isEligibleForNFTBoost = accountNFTPositions.hasEverHeldUnshETHNFT || accountNFTPositions.hasEverHeldMMCNFT;
  account.save();
  return account;
}