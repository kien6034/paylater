"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDA = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const MARKET_SEED = "market";
const MARKET_VAULT_SEED = "market_vault";
class PDA {
    constructor(programId, tokenMint) {
        this.getMarketPDA = () => {
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(MARKET_SEED),
                this.tokenMint.toBuffer(),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.getMarketVaultPDA = () => {
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(MARKET_VAULT_SEED),
                this.tokenMint.toBuffer(),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.programId = programId;
        this.tokenMint = tokenMint;
    }
}
exports.PDA = PDA;
