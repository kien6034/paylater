/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Paylater } from "../artifacts/paylater";
import { u64 } from "@solana/spl-token";
export type BuyFirst = {
    amount: u64;
    otherAmountThreshold: u64;
    sqrtPriceLimit: BN;
    amountSpecifiedIsInput: boolean;
    aToB: boolean;
    user: PublicKey;
    userTokenAccount: PublicKey;
    whirlpoolProgram: PublicKey;
    whirlpool: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    oracle: PublicKey;
    tokenAuthority: PublicKey;
    tickArray0: PublicKey;
    tickArray1: PublicKey;
    tickArray2: PublicKey;
};
export declare function buyFirst(program: Program<Paylater>, params: BuyFirst): Promise<Instruction>;
