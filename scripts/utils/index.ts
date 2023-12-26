import { PublicKey, Connection, Keypair, Commitment } from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { PDA, ProgramContext } from "../../sdk/src";
import { env } from "../env";

export * from "./wallet";
export * from "./token";

export type ProgramFixture = {
  ctx: ProgramContext;
  marketId: string;
  bondTokenMint: PublicKey;
  accessTokenMint: PublicKey;
};

export const getFixture = async function (
  feePayerAuthority: Keypair
): Promise<ProgramFixture> {
  const commitment: Commitment = "finalized";
  const connection = new Connection(env.RPC_END_POINT);

  const wallet = new Wallet(feePayerAuthority);
  const ctx = ProgramContext.from(
    connection,
    wallet,
    new PublicKey(env.PROGRAM_ID),
    { commitment }
  );

  const bondTokenMint = new PublicKey(env.BOND_TOKEN_MINT);
  const accessTokenMint = new PublicKey(env.ACCESS_TOKEN_MINT);
  const marketId = env.MARKET_ID;
  return {
    ctx,
    marketId,
    bondTokenMint,
    accessTokenMint,
  };
};
