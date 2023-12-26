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
exports.lockToken = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
function lockToken(program, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, userTokenAccount, tokenMint, market, tokenVault, amount } = params;
        const ix = yield program.methods
            .lockToken(amount)
            .accounts({
            user,
            userTokenAccount,
            tokenMint,
            market: market.key,
            tokenVault: tokenVault.key,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
            systemProgram: web3_js_1.SystemProgram.programId,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        })
            .instruction();
        return {
            instructions: [ix],
            cleanupInstructions: [],
            signers: [],
        };
    });
}
exports.lockToken = lockToken;
