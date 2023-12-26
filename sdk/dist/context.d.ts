import { AnchorProvider, Program } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { SwapOnOff } from "./artifacts/swap_on_off";
import { ProgramIx } from "./ix";
/**
 * @category Core
 */
export declare class ProgramContext {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly opts: ConfirmOptions;
    readonly program: Program<SwapOnOff>;
    readonly provider: AnchorProvider;
    ixs: ProgramIx;
    static from(connection: Connection, wallet: Wallet, programId: PublicKey, opts?: ConfirmOptions): ProgramContext;
    constructor(provider: AnchorProvider, wallet: Wallet, program: Program, opts: ConfirmOptions);
}
