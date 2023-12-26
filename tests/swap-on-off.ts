import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SwapOnOff } from "../target/types/swap_on_off";

describe("swap-on-off", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SwapOnOff as Program<SwapOnOff>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
