import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { SwapOnOff } from "../artifacts/swap_on_off";
import { PDAInfo } from "../pda";
export type InitializeConfigParams = {
    initializer: PublicKey;
    signer: PublicKey;
    tokenMint: PublicKey;
    market: PDAInfo;
    tokenVault: PDAInfo;
};
export declare function initializeConfig(program: Program<SwapOnOff>, params: InitializeConfigParams): Promise<Instruction>;
