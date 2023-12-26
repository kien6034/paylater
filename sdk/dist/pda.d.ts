import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
export interface PDAInfo {
    key: anchor.web3.PublicKey;
    bump: number;
}
export declare class PDA {
    readonly programId: anchor.web3.PublicKey;
    readonly tokenMint: PublicKey;
    constructor(programId: anchor.web3.PublicKey, tokenMint: PublicKey);
    getMarketPDA: () => PDAInfo;
    getMarketVaultPDA: () => PDAInfo;
}
