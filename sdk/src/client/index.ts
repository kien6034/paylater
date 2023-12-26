import { ProgramContext } from "../context";
import {
  PublicKey,
  Connection,
  Keypair,
  Ed25519Program,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TransactionBuilder,
  resolveOrCreateATA,
  deriveATA,
  Instruction,
  resolveOrCreateATAs,
  ZERO,
} from "@orca-so/common-sdk";
import { PDA } from "../pda";
import { BN, toInstruction } from "@project-serum/anchor";
import { AccountLayout } from "@solana/spl-token";
import * as ed25519 from "@noble/ed25519";
import {
  SwapUtils,
  TickArrayUtil,
  WhirlpoolContext,
} from "@renec-foundation/nemoswap-sdk";
import {
  SwapAsyncParams,
  swapIx,
} from "@renec-foundation/nemoswap-sdk/dist/instructions";

const getTokenAccountRentExempt = async (
  connection: Connection,
  refresh: boolean = false
) => {
  // This value should be relatively static or at least not break according to spec
  // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
  let rentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  return rentExempt;
};

export class Client {
  ctx: ProgramContext;
  public pda: PDA;
  public tokenMint: PublicKey;

  constructor(ctx: ProgramContext, tokenMint: PublicKey) {
    this.ctx = ctx;
    this.pda = new PDA(ctx.program.programId, tokenMint);
    this.tokenMint = tokenMint;
  }

  public async initMarket(signer: PublicKey): Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();

    const ix = await this.ctx.ixs.initializeConfig({
      initializer: this.ctx.wallet.publicKey,
      signer: signer,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
    });

    return ix.toTx();
  }

  public async lockToken(amount: BN): Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();
    const userTokenAccount = await deriveATA(
      this.ctx.wallet.publicKey,
      this.tokenMint
    );

    const ix = await this.ctx.ixs.lockToken({
      user: this.ctx.wallet.publicKey,
      userTokenAccount: userTokenAccount,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
      amount: amount,
    });

    return ix.toTx();
  }

  public async buyFirst(
    whirlpoolCtx: WhirlpoolContext,
    params: SwapAsyncParams,
    refresh: boolean = false
  ): Promise<TransactionBuilder> {
    const { wallet, whirlpool, swapInput } = params;
    const { aToB, amount } = swapInput;
    const txBuilder = new TransactionBuilder(
      whirlpoolCtx.connection,
      whirlpoolCtx.wallet
    );
    const tickArrayAddresses = [
      swapInput.tickArray0,
      swapInput.tickArray1,
      swapInput.tickArray2,
    ];

    let uninitializedArrays = await TickArrayUtil.getUninitializedArraysString(
      tickArrayAddresses,
      whirlpoolCtx.fetcher,
      refresh
    );
    if (uninitializedArrays) {
      throw new Error(
        `TickArray addresses - [${uninitializedArrays}] need to be initialized.`
      );
    }

    const data = whirlpool.getData();
    const [resolvedAtaA, resolvedAtaB] = await resolveOrCreateATAs(
      whirlpoolCtx.connection,
      wallet,
      [
        {
          tokenMint: data.tokenMintA,
          wrappedSolAmountIn: aToB ? amount : ZERO,
        },
        {
          tokenMint: data.tokenMintB,
          wrappedSolAmountIn: !aToB ? amount : ZERO,
        },
      ],
      () => whirlpoolCtx.fetcher.getAccountRentExempt()
    );

    const { address: ataAKey, ...tokenOwnerAccountAIx } = resolvedAtaA;
    const { address: ataBKey, ...tokenOwnerAccountBIx } = resolvedAtaB;
    txBuilder.addInstructions([tokenOwnerAccountAIx, tokenOwnerAccountBIx]);
    const inputTokenAccount = aToB ? ataAKey : ataBKey;
    const outputTokenAccount = aToB ? ataBKey : ataAKey;

    return txBuilder.addInstruction(
      swapIx(
        whirlpoolCtx.program,
        SwapUtils.getSwapParamsFromQuote(
          swapInput,
          whirlpoolCtx,
          whirlpool,
          inputTokenAccount,
          outputTokenAccount,
          wallet
        )
      )
    );
  }
}
