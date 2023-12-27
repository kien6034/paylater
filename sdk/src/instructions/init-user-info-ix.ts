import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type InitUserInfoParams = {
  user: PublicKey;
  market: PublicKey;
  userInfo: PublicKey;
};

export async function initUserInfo(
  program: Program<Paylater>,
  params: InitUserInfoParams
): Promise<Instruction> {
  const { user, market, userInfo } = params;
  const ix = await program.methods
    .initUserInfo()
    .accounts({
      user,
      market,
      userInfo,
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
