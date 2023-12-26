import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "../sdk/src";
import { BN } from "@project-serum/anchor";

/**
 * @usage swap off-on
 */
const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER]);

  const deployer = wallets[ROLES.DEPLOYER];

  let user = deployer;
  let signer = deployer;
  const { ctx, tokenMint } = await getFixture(deployer);

  const client = new Client(ctx, tokenMint);

  // lock amount
  const unlockAmount = new BN(1000);

  let txId = "tx1";
  let signature = await client.getUnlockSignatureMsg(
    txId,
    user.publicKey,
    tokenMint,
    unlockAmount,
    signer
  );

  const tx = await client.unlockToken(txId, unlockAmount, signature);
  const hash = await tx.buildAndExecute();
  console.log("hash: ", hash);
};

main().catch((error) => console.log(error));
