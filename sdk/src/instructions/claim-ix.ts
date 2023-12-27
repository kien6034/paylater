import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type ClaimParams = {
  user: PublicKey;
  amount: BN;

  market: PublicKey;
  contract: PublicKey;
  bondTokenVault: PublicKey;
  accessTokenVault: PublicKey;
  userBondTokenAccount: PublicKey;
  userAccessTokenAccount: PublicKey;
};

export async function claim(
  program: Program<Paylater>,
  params: ClaimParams
): Promise<Instruction> {
  const {
    user,
    market,
    amount,
    contract,
    bondTokenVault,
    accessTokenVault,
    userAccessTokenAccount,
    userBondTokenAccount,
  } = params;

  const ix = await program.methods
    .claim(amount)
    .accounts({
      user,
      market,
      contract,
      bondTokenVault,
      accessTokenVault,
      userAccessTokenAccount,
      userBondTokenAccount,
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
