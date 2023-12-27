import { getFixture, transferToken } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "../sdk/src";
import { deriveATA } from "@orca-so/common-sdk";

const main = async () => {
  // Get amount from terminal

  const wallets = getWallets([ROLES.USER]);

  const user = wallets[ROLES.USER];
  const { ctx, marketId, bondTokenMint, accessTokenMint } = await getFixture(
    user
  );

  const client = new Client(ctx, marketId, bondTokenMint, accessTokenMint);

  // Fetch market info
  const market = await client.getMarket();

  if (!market) {
    throw new Error("Market not initialized");
  }

  const userTokenAccount = await deriveATA(user.publicKey, bondTokenMint);

  // Fund vault
  const hash = await transferToken(
    ctx.provider,
    userTokenAccount,
    market.bondTokenVault,
    100000000000
  );

  console.log("hash: ", hash);
};

main().catch((error) => console.log(error));
