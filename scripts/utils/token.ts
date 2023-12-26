import { AnchorProvider } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function transferToken(
  provider: AnchorProvider,
  source: PublicKey,
  destination: PublicKey,
  amount: number
) {
  const tx = new Transaction();
  tx.add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      source,
      destination,
      provider.wallet.publicKey,
      [],
      amount
    )
  );
  return provider.sendAndConfirm(tx, [], { commitment: "confirmed" });
}
