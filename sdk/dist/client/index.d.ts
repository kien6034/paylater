/// <reference types="bn.js" />
import { ProgramContext } from "../context";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PDA } from "../pda";
import { BN } from "@project-serum/anchor";
import { WhirlpoolContext } from "@renec-foundation/nemoswap-sdk";
import { SwapAsyncParams } from "@renec-foundation/nemoswap-sdk/dist/instructions";
export declare class Client {
    ctx: ProgramContext;
    pda: PDA;
    tokenMint: PublicKey;
    constructor(ctx: ProgramContext, tokenMint: PublicKey);
    initMarket(signer: PublicKey): Promise<TransactionBuilder>;
    lockToken(amount: BN): Promise<TransactionBuilder>;
    buyFirst(whirlpoolCtx: WhirlpoolContext, params: SwapAsyncParams, refresh?: boolean): Promise<TransactionBuilder>;
}
