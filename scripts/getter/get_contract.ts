import { getFixture } from "../utils";
import { getWallets, ROLES } from "../utils/";
import { Client } from "../../sdk/src";
import { BN } from "@project-serum/anchor";

const main = async () => {
  const wallets = getWallets([ROLES.USER]);

  const user = wallets[ROLES.USER];
  const { ctx, marketId, bondTokenMint, accessTokenMint } = await getFixture(
    user
  );

  const client = new Client(ctx, marketId, bondTokenMint, accessTokenMint);

  const userInfo = await client.getUserData();

  console.log("--- user info ----");
  console.log("user: ", client.ctx.wallet.publicKey.toString());

  if (!userInfo) {
    console.log("no user info");
    return;
  }
  console.log(userInfo.currentContractId.toString());

  console.log("\n Getting contract data");
  const contract = await client.getContract(
    userInfo.currentContractId.sub(new BN(1))
  );
  console.log(contract);
};

main().catch((error) => console.log(error));
