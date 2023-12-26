import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type LockTokenParams = {
  user: PublicKey;
  userTokenAccount: PublicKey;
  tokenMint: PublicKey;
  market: PDAInfo;
  tokenVault: PDAInfo;
  amount: BN;
};

export async function lockToken(
  program: Program<Paylater>,
  params: LockTokenParams
): Promise<Instruction> {
  const { user, userTokenAccount, tokenMint, market, tokenVault, amount } =
    params;
  const ix = await program.methods
    .lockToken(amount)
    .accounts({
      user,
      userTokenAccount,
      tokenMint,
      market: market.key,
      tokenVault: tokenVault.key,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
