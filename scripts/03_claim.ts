import { getFixture, transferToken } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "../sdk/src";
import { deriveATA } from "@orca-so/common-sdk";
import { BN } from "@project-serum/anchor";

const main = async () => {
  // Get amount from terminal
  const contractId = new BN(process.argv[2]);
  const claimAmount = new BN(process.argv[3]);

  console.log("contractId: ", contractId.toString());

  const wallets = getWallets([ROLES.USER]);

  const user = wallets[ROLES.USER];
  console.log("user: ", user.publicKey.toString());

  const { ctx, marketId, bondTokenMint, accessTokenMint } = await getFixture(
    user
  );

  const client = new Client(ctx, marketId, bondTokenMint, accessTokenMint);

  const tx = await client.claim(contractId, claimAmount);
  const hash = await tx.buildAndExecute();
  console.log("hash: ", hash);
};

main().catch((error) => console.log(error));
