"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const pda_1 = require("../pda");
const spl_token_1 = require("@solana/spl-token");
const nemoswap_sdk_1 = require("@renec-foundation/nemoswap-sdk");
const getTokenAccountRentExempt = (connection, refresh = false) => __awaiter(void 0, void 0, void 0, function* () {
    // This value should be relatively static or at least not break according to spec
    // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
    let rentExempt = yield connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    return rentExempt;
});
class Client {
    constructor(ctx, tokenMint) {
        this.ctx = ctx;
        this.pda = new pda_1.PDA(ctx.program.programId, tokenMint);
        this.tokenMint = tokenMint;
    }
    initMarket(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.pda.getMarketPDA();
            const tokenVault = this.pda.getMarketVaultPDA();
            const ix = yield this.ctx.ixs.initializeConfig({
                initializer: this.ctx.wallet.publicKey,
                signer: signer,
                tokenMint: this.tokenMint,
                market: market,
                tokenVault: tokenVault,
            });
            return ix.toTx();
        });
    }
    lockToken(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.pda.getMarketPDA();
            const tokenVault = this.pda.getMarketVaultPDA();
            const userTokenAccount = yield (0, common_sdk_1.deriveATA)(this.ctx.wallet.publicKey, this.tokenMint);
            const ix = yield this.ctx.ixs.lockToken({
                user: this.ctx.wallet.publicKey,
                userTokenAccount: userTokenAccount,
                tokenMint: this.tokenMint,
                market: market,
                tokenVault: tokenVault,
                amount: amount,
            });
            return ix.toTx();
        });
    }
    buyFirst(whirlpoolCtx, params, refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { wallet, whirlpool, swapInput } = params;
            const { aToB, amount } = swapInput;
            const txBuilder = new common_sdk_1.TransactionBuilder(whirlpoolCtx.connection, whirlpoolCtx.wallet);
            const tickArrayAddresses = [
                swapInput.tickArray0,
                swapInput.tickArray1,
                swapInput.tickArray2,
            ];
            let uninitializedArrays = yield nemoswap_sdk_1.TickArrayUtil.getUninitializedArraysString(tickArrayAddresses, whirlpoolCtx.fetcher, refresh);
            if (uninitializedArrays) {
                throw new Error(`TickArray addresses - [${uninitializedArrays}] need to be initialized.`);
            }
            const data = whirlpool.getData();
            const [resolvedAtaA, resolvedAtaB] = yield (0, common_sdk_1.resolveOrCreateATAs)(whirlpoolCtx.connection, wallet, [
                {
                    tokenMint: data.tokenMintA,
                    wrappedSolAmountIn: aToB ? amount : common_sdk_1.ZERO,
                },
                {
                    tokenMint: data.tokenMintB,
                    wrappedSolAmountIn: !aToB ? amount : common_sdk_1.ZERO,
                },
            ], () => whirlpoolCtx.fetcher.getAccountRentExempt());
            const { address: ataAKey } = resolvedAtaA, tokenOwnerAccountAIx = __rest(resolvedAtaA, ["address"]);
            const { address: ataBKey } = resolvedAtaB, tokenOwnerAccountBIx = __rest(resolvedAtaB, ["address"]);
            txBuilder.addInstructions([tokenOwnerAccountAIx, tokenOwnerAccountBIx]);
            const inputTokenAccount = aToB ? ataAKey : ataBKey;
            const outputTokenAccount = aToB ? ataBKey : ataAKey;
            let swapParams = nemoswap_sdk_1.SwapUtils.getSwapParamsFromQuote(swapInput, whirlpoolCtx, whirlpool, inputTokenAccount, outputTokenAccount, wallet);
            let instruction = yield this.ctx.ixs.buyFirst({
                amount: swapInput.amount,
                otherAmountThreshold: swapInput.otherAmountThreshold,
                sqrtPriceLimit: swapInput.sqrtPriceLimit,
                amountSpecifiedIsInput: swapInput.amountSpecifiedIsInput,
                aToB: swapInput.aToB,
                user: wallet,
                userTokenAccount: inputTokenAccount,
                whirlpoolProgram: whirlpoolCtx.program.programId,
                whirlpool: whirlpool.getAddress(),
                tokenOwnerAccountA: swapParams.tokenOwnerAccountA,
                tokenOwnerAccountB: swapParams.tokenOwnerAccountB,
                tokenVaultA: swapParams.tokenVaultA,
                tokenVaultB: swapParams.tokenVaultB,
                oracle: swapParams.oracle,
                tokenAuthority: swapParams.tokenAuthority,
                tickArray0: swapInput.tickArray0,
                tickArray1: swapInput.tickArray1,
                tickArray2: swapInput.tickArray2,
            });
            return instruction.toTx();
        });
    }
}
exports.Client = Client;
