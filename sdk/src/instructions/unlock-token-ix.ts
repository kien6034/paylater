import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { SwapOnOff } from "../artifacts/swap_on_off";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type UnlockTokenParams = {
  txId: string;
  user: PublicKey;
  userTokenAccount: PublicKey;
  tokenMint: PublicKey;
  market: PDAInfo;
  tokenVault: PDAInfo;
  amount: BN;
  sig: Uint8Array;
};

export async function unlockToken(
  program: Program<SwapOnOff>,
  params: UnlockTokenParams
): Promise<Instruction> {
  const {
    txId,
    user,
    userTokenAccount,
    tokenMint,
    market,
    tokenVault,
    amount,
    sig,
  } = params;
  const ix = await program.methods
    .unlockToken(txId, amount, Array.from(sig))
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
