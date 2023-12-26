
import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import {Client}  from "../sdk/src";


const main = async () => {
  const wallets = getWallets([
    ROLES.DEPLOYER,
  ]);

  const deployer = wallets[ROLES.DEPLOYER];
  const { ctx, tokenMint } = await getFixture(deployer);

  
  const client = new Client(ctx, tokenMint);

  const signer = deployer.publicKey; // key for signer 
  const tx = await client.initMarket(signer);
  const hash = await tx.buildAndExecute();
  console.log("hash: ",   hash);
};


main().catch((error) => console.log(error));
