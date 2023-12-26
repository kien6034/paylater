import { BN, BorshAccountsCoder, Idl } from "@project-serum/anchor";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import PaylaterIDL from "../artifacts/paylater.json";

const IDL = PaylaterIDL as Idl;

export enum AccountName {
  Market = "Market",
}

export const PROGRAM_CODER = new BorshAccountsCoder(IDL);

export const sizeOf = (accountName: AccountName): number => {
  const idlAccount = IDL.accounts?.find(
    (account) => account.name == accountName
  );
  if (idlAccount) {
    return PROGRAM_CODER.size(idlAccount);
  }
  return -1;
};

export const MARKET_STATE_SIZE = sizeOf(AccountName.Market);

export type MarketData = {
  marketId: string;
  initializer: PublicKey;
  bondToken: PublicKey;
  accessToken: PublicKey;
  bondTokenVault: PublicKey;
  accessTokenVault: PublicKey;
  marketBump: number;
};
