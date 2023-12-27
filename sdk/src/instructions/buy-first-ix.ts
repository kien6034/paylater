import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { u64 } from "@solana/spl-token";

export type BuyFirst = {
  market: PublicKey;

  userInfo: PublicKey;
  contract: PublicKey;

  bondTokenVault: PublicKey;
  accessTokenVault: PublicKey;

  amount: u64;
  otherAmountThreshold: u64;
  sqrtPriceLimit: BN;
  amountSpecifiedIsInput: boolean;
  aToB: boolean;

  user: PublicKey;
  userTokenAccount: PublicKey;
  whirlpoolProgram: PublicKey;
  whirlpool: PublicKey;
  tokenOwnerAccountA: PublicKey;
  tokenOwnerAccountB: PublicKey;
  tokenVaultA: PublicKey;
  tokenVaultB: PublicKey;
  oracle: PublicKey;
  tokenAuthority: PublicKey;
  tickArray0: PublicKey;
  tickArray1: PublicKey;
  tickArray2: PublicKey;
};

export async function buyFirst(
  program: Program<Paylater>,
  params: BuyFirst
): Promise<Instruction> {
  // log all the accounts, under base 58 with notes
  // console.log("--------------------");
  // console.log("user: ", params.user.toBase58());
  // console.log("userTokenAccount: ", params.userTokenAccount.toBase58());
  // console.log("whirlpoolProgram: ", params.whirlpoolProgram.toBase58());
  // console.log("whirlpool: ", params.whirlpool.toBase58());
  // console.log("tokenOwnerAccountA: ", params.tokenOwnerAccountA.toBase58());
  // console.log("tokenOwnerAccountB: ", params.tokenOwnerAccountB.toBase58());
  // console.log("tokenVaultA: ", params.tokenVaultA.toBase58());
  // console.log("tokenVaultB: ", params.tokenVaultB.toBase58());
  // console.log("oracle: ", params.oracle.toBase58());
  // console.log("tokenAuthority: ", params.tokenAuthority.toBase58());
  // console.log("tickArray0: ", params.tickArray0.toBase58());
  // console.log("tickArray1: ", params.tickArray1.toBase58());
  // console.log("tickArray2: ", params.tickArray2.toBase58());
  // console.log("market: ", params.market.toBase58());
  // console.log("bondTokenVault: ", params.bondTokenVault.toBase58());
  // console.log("acccessTokenVault: ", params.accessTokenVault.toBase58());
  // console.log("--------------------");

  const ix = await program.methods
    .buyFirst(params.amount, params.otherAmountThreshold, params.sqrtPriceLimit)
    .accounts({
      user: params.user,
      market: params.market,
      userInfo: params.userInfo,
      contract: params.contract,
      bondTokenVault: params.bondTokenVault,
      accessTokenVault: params.accessTokenVault,
      whirlpoolProgram: params.whirlpoolProgram,
      whirlpool: params.whirlpool,
      tokenOwnerAccountA: params.tokenOwnerAccountA,
      tokenOwnerAccountB: params.tokenOwnerAccountB,
      tokenVaultA: params.tokenVaultA,
      tokenVaultB: params.tokenVaultB,
      oracle: params.oracle,
      tickArray0: params.tickArray0,
      tickArray1: params.tickArray1,
      tickArray2: params.tickArray2,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
