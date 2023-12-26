import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { PDAInfo } from "../pda";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type InitializeConfigParams = {
  marketId: string;
  initializer: PublicKey;
  signer: PublicKey;
  bondTokenMint: PublicKey;
  accessTokenMint: PublicKey;
  market: PDAInfo;
  bondTokenVault: PDAInfo;
  accessTokenVault: PDAInfo;
};

export async function initializeConfig(
  program: Program<Paylater>,
  params: InitializeConfigParams
): Promise<Instruction> {
  const {
    marketId,
    initializer,
    signer,
    bondTokenMint,
    accessTokenMint,
    market,
    bondTokenVault,
    accessTokenVault,
  } = params;
  const ix = await program.methods
    .initialize(marketId, market.bump)
    .accounts({
      initializer,
      signer,
      bondTokenMint,
      accessTokenMint,
      market: market.key,
      bondTokenVault: bondTokenVault.key,
      accessTokenVault: accessTokenVault.key,
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
