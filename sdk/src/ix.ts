import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { ProgramContext } from "./context";
import * as ixs from "./instructions";

export class ProgramIx {
  private ctx: ProgramContext;
  public ix: Instruction | null | undefined;

  constructor(ctx: ProgramContext) {
    this.ctx = ctx;
  }

  public async initializeConfig(params: ixs.InitializeConfigParams) {
    this.ix = await ixs.initializeConfig(this.ctx.program, params);
    return this;
  }

  public async initUserInfo(params: ixs.InitUserInfoParams) {
    this.ix = await ixs.initUserInfo(this.ctx.program, params);
    return this;
  }

  public async buyFirst(params: ixs.BuyFirst) {
    this.ix = await ixs.buyFirst(this.ctx.program, params);
    return this;
  }

  public async claim(params: ixs.ClaimParams) {
    this.ix = await ixs.claim(this.ctx.program, params);
    return this;
  }

  public toTx(): TransactionBuilder {
    const tx = new TransactionBuilder(
      this.ctx.provider.connection,
      this.ctx.provider.wallet
    );
    return this.ix ? tx.addInstruction(this.ix) : tx;
  }
}
