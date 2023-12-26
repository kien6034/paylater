import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "../sdk/src";
import { BN } from "@project-serum/anchor";

/**
 * @usage chuyển token từ ví của user lên contract == swap(on-off)
 */
const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER]);

  const deployer = wallets[ROLES.DEPLOYER];
  const { ctx, tokenMint } = await getFixture(deployer);

  const client = new Client(ctx, tokenMint);

  // lock amount
  const lockAmount = new BN(1000);

  const tx = await client.lockToken(lockAmount);
  const hash = await tx.buildAndExecute();
  console.log("hash: ", hash);
};

main().catch((error) => console.log(error));

// user -> lockToken -> contract
// BE: hứng event lockToken + tăng balance token off-chain
