/// <reference types="bn.js" />
import { ProgramContext } from "../context";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PDA } from "../pda";
import { BN } from "@project-serum/anchor";
export declare class Client {
    ctx: ProgramContext;
    pda: PDA;
    tokenMint: PublicKey;
    constructor(ctx: ProgramContext, tokenMint: PublicKey);
    initMarket(signer: PublicKey): Promise<TransactionBuilder>;
    lockToken(amount: BN): Promise<TransactionBuilder>;
    unlockToken(amount: BN): Promise<TransactionBuilder>;
}
