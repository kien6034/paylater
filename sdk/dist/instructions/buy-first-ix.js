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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyFirst = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
function buyFirst(program, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // log all the accounts, under base 58 with notes
        console.log("--------------------");
        console.log("user: ", params.user.toBase58());
        console.log("userTokenAccount: ", params.userTokenAccount.toBase58());
        console.log("whirlpoolProgram: ", params.whirlpoolProgram.toBase58());
        console.log("whirlpool: ", params.whirlpool.toBase58());
        console.log("tokenOwnerAccountA: ", params.tokenOwnerAccountA.toBase58());
        console.log("tokenOwnerAccountB: ", params.tokenOwnerAccountB.toBase58());
        console.log("tokenVaultA: ", params.tokenVaultA.toBase58());
        console.log("tokenVaultB: ", params.tokenVaultB.toBase58());
        console.log("oracle: ", params.oracle.toBase58());
        console.log("tokenAuthority: ", params.tokenAuthority.toBase58());
        console.log("tickArray0: ", params.tickArray0.toBase58());
        console.log("tickArray1: ", params.tickArray1.toBase58());
        console.log("tickArray2: ", params.tickArray2.toBase58());
        console.log("--------------------");
        const ix = yield program.methods
            .buyFirst(params.amount, params.otherAmountThreshold, params.sqrtPriceLimit, params.amountSpecifiedIsInput, params.aToB)
            .accounts({
            user: params.user,
            userTokenAccount: params.userTokenAccount,
            whirlpoolProgram: params.whirlpoolProgram,
            whirlpool: params.whirlpool,
            tokenOwnerAccountA: params.tokenOwnerAccountA,
            tokenOwnerAccountB: params.tokenOwnerAccountB,
            tokenVaultA: params.tokenVaultA,
            tokenVaultB: params.tokenVaultB,
            oracle: params.oracle,
            tickArray0: params.tickArray0,
            tickArray1: params.tickArray1,
            tickArray2: params.tickArray2,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        })
            .instruction();
        return {
            instructions: [ix],
            cleanupInstructions: [],
            signers: [],
        };
    });
}
exports.buyFirst = buyFirst;
