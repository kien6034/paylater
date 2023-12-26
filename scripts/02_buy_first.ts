import { PublicKey } from "@solana/web3.js";
import { MathUtil, Percentage } from "@orca-so/common-sdk";
import {
  PDAUtil,
  buildWhirlpoolClient,
  swapQuoteByInputToken,
  swapQuoteByOutputToken,
} from "@renec-foundation/nemoswap-sdk";
import { getPoolInfo } from "./nemo/utils/pool";
import { u64 } from "@solana/spl-token";
import { Wallet } from "@project-serum/anchor";
import { ROLES, getFixture, getWallets } from "./utils";
import {
  getConfig,
  getTokenMintInfo,
  loadProvider as loadNemoProvider,
  loadProvider,
} from "./nemo";
import { Client } from "../sdk/src";

async function main() {
  let poolInfo = getPoolInfo(0); // NOTE: hard fix: use default pool index 0

  const wallets = getWallets([ROLES.USER]);
  const userKeypair = wallets[ROLES.USER];

  const { ctx: whirlpoolContext } = loadProvider(userKeypair);
  const nemoConfig = getConfig();

  if (nemoConfig.REDEX_CONFIG_PUBKEY === "") {
    console.log(
      "ReDEX Pool Config is not found. Please run `npm run 00-create-pool-config` ."
    );
    return;
  }
  const REDEX_CONFIG_PUB = new PublicKey(nemoConfig.REDEX_CONFIG_PUBKEY);
  const nemoClient = buildWhirlpoolClient(whirlpoolContext);

  const mintAPub = new PublicKey(poolInfo.tokenMintA);
  const mintBPub = new PublicKey(poolInfo.tokenMintB);
  const tokenMintA = await getTokenMintInfo(whirlpoolContext, mintAPub);
  const tokenMintB = await getTokenMintInfo(whirlpoolContext, mintBPub);

  if (!tokenMintA || !tokenMintB) {
    throw new Error("Token mint info is not found.");
  }

  // Get whirlpool
  const whirlpoolPda = PDAUtil.getWhirlpool(
    whirlpoolContext.program.programId,
    REDEX_CONFIG_PUB,
    mintAPub,
    mintBPub,
    poolInfo.tickSpacing
  );
  const whirlpool = await nemoClient.getPool(whirlpoolPda.publicKey);
  const whirlpoolData = whirlpool.getData();

  const quote = await swapQuoteByOutputToken(
    whirlpool,
    whirlpoolData.tokenMintB,
    new u64(100000),
    Percentage.fromFraction(1, 100),
    whirlpoolContext.program.programId,
    whirlpoolContext.fetcher,
    true
  );

  const {
    ctx: paylaterContext,
    marketId,
    bondTokenMint,
    accessTokenMint,
  } = await getFixture(userKeypair);
  const client = new Client(
    paylaterContext,
    marketId,
    bondTokenMint,
    accessTokenMint
  );

  const tx = await client.buyFirst(
    whirlpoolContext,
    {
      wallet: userKeypair.publicKey,
      whirlpool: whirlpool,
      swapInput: quote,
    },
    true
  );

  const hash = await tx.buildAndExecute();
  console.log("Transaction hash:", hash);
}

main().catch((reason) => {
  console.log("ERROR:", reason);
});
