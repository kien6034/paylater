import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { PDAInfo } from "../pda";
export type InitializeConfigParams = {
    initializer: PublicKey;
    signer: PublicKey;
    tokenMint: PublicKey;
    market: PDAInfo;
    tokenVault: PDAInfo;
};
export declare function initializeConfig(program: Program<Paylater>, params: InitializeConfigParams): Promise<Instruction>;
