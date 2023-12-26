import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { SwapOnOff } from "../artifacts/swap_on_off";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type InitializeConfigParams = {
  initializer: PublicKey;
  signer: PublicKey;
  tokenMint: PublicKey;
  market: PDAInfo;
  tokenVault: PDAInfo;
};

export async function initializeConfig(
  program: Program<SwapOnOff>,
  params: InitializeConfigParams
): Promise<Instruction> {
  const { initializer, signer, tokenMint, market, tokenVault } = params;
  const ix = await program.methods
    .initialize(market.bump)
    .accounts({
      initializer,
      signer,
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
