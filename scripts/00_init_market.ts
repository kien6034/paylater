import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "../sdk/src";

const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER]);

  const deployer = wallets[ROLES.DEPLOYER];
  const { ctx, marketId, bondTokenMint, accessTokenMint } = await getFixture(
    deployer
  );

  const client = new Client(ctx, marketId, bondTokenMint, accessTokenMint);

  const signer = deployer.publicKey; // key for signer

  try {
    const tx = await client.initMarket(signer);
    const hash = await tx.buildAndExecute();
    console.log("hash: ", hash);
  } catch (error) {
    console.log("error: ", error);
    console.log("MARKET INITIALIZED");
  }

  // Fetch market info
  console.log("\n --- Fetch market info --- ");
  const market = await client.getMarket();
  console.log("market: ", market);
};

main().catch((error) => console.log(error));
