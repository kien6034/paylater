import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { ProgramContext } from "./context";
import * as ixs from "./instructions";
export declare class ProgramIx {
    private ctx;
    ix: Instruction | null | undefined;
    constructor(ctx: ProgramContext);
    initializeConfig(params: ixs.InitializeConfigParams): Promise<this>;
    lockToken(params: ixs.LockTokenParams): Promise<this>;
    unlockToken(params: ixs.UnlockTokenParams): Promise<this>;
    buyFirst(params: ixs.BuyFirst): Promise<this>;
    toTx(): TransactionBuilder;
}
