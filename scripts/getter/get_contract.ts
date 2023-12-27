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

  console.log("\n Getting contract data");

  let contractId;
  if (process.argv[2]) {
    contractId = new BN(process.argv[2]);
  } else {
    contractId = userInfo.currentContractId.sub(new BN(1));
  }
  const contract = await client.getContract(contractId);

  if (!contract) {
    console.log("no contract");
    return;
  }
  console.log("\n ---Contract info");
  console.log("contract id: ", contract.contractId.toString());
  console.log("total bond amount: ", contract.totalBondAmount.toString());
  console.log(
    "total access token amount: ",
    contract.totalAccessAmount.toString()
  );
  console.log("bond amount paid: ", contract.bondAmountPaid.toString());
  console.log("access amount paid: ", contract.accessAmountPaid.toString());
};

main().catch((error) => console.log(error));
