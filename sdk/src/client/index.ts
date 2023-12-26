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
} from "@orca-so/common-sdk";
import { PDA } from "../pda";
import { BN, toInstruction } from "@project-serum/anchor";
import { AccountLayout } from "@solana/spl-token";
import * as ed25519 from "@noble/ed25519";

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

  public async getUnlockSignatureMsg(
    internalId: string,
    user: PublicKey,
    tokenMint: PublicKey,
    amount: BN,
    signer: Keypair
  ): Promise<SignatureResponse> {
    let msg = getUnlockTxBytes(internalId, user, tokenMint, amount);
    let sig = await getSignature(signer, msg);

    return {
      msg: msg,
      signature: sig,
      publicKey: signer.publicKey,
    };
  }

  public async unlockToken(
    txId: string,
    amount: BN,
    signatureResponse: SignatureResponse
  ): Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();
    const { address: userTokenAccount, ...createuserTokenAccountInstruction } =
      await resolveOrCreateATA(
        this.ctx.connection,
        this.ctx.wallet.publicKey,
        this.tokenMint,
        () => getTokenAccountRentExempt(this.ctx.connection),
        undefined,
        this.ctx.wallet.publicKey
      );

    //Construct ed25510 x
    let ed25519TxId: TransactionInstruction =
      Ed25519Program.createInstructionWithPublicKey({
        publicKey: signatureResponse.publicKey.toBytes(),
        message: signatureResponse.msg,
        signature: signatureResponse.signature,
      });
    let ed25519Ix: Instruction = {
      instructions: [ed25519TxId],
      cleanupInstructions: [],
      signers: [],
    };

    const ix = await this.ctx.ixs.unlockToken({
      user: this.ctx.wallet.publicKey,
      userTokenAccount: userTokenAccount,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
      amount: amount,
      sig: signatureResponse.signature,
      txId: txId,
    });

    return ix
      .toTx()
      .prependInstruction(ed25519Ix)
      .prependInstruction(createuserTokenAccountInstruction);
  }
}

const getUnlockTxBytes = (
  internalId: string,
  user: PublicKey,
  tokenMint: PublicKey,
  amount: BN
) => {
  const allBytes = [
    Uint8Array.from(Buffer.from(internalId)), // internal id
    Uint8Array.from(user.toBytes()), // user addr
    Uint8Array.from(tokenMint.toBytes()), // mint addr
    Uint8Array.from(amount.toArray(undefined, 8)), // amount
  ];

  let msg_bytes_len = 0;
  for (const bytes of allBytes) {
    msg_bytes_len += bytes.length;
  }
  let msg_bytes = new Uint8Array(msg_bytes_len);

  // set the msg bytes
  var offset = 0;
  for (const bytes of allBytes) {
    msg_bytes.set(bytes, offset);
    offset += bytes.length;
  }

  return msg_bytes;
};

export const getSignature = async (
  signer: Keypair,
  msg: Uint8Array
): Promise<Uint8Array> => {
  let signature: Uint8Array;
  signature = ed25519.sign(msg, signer.secretKey.slice(0, 32));
  return signature;
};

export type SignatureResponse = {
  msg: Uint8Array;
  signature: Uint8Array;
  publicKey: PublicKey;
};
