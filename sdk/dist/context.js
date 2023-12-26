"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramContext = void 0;
const anchor_1 = require("@project-serum/anchor");
const paylater_json_1 = __importDefault(require("./artifacts/paylater.json"));
const ix_1 = require("./ix");
/**
 * @category Core
 */
class ProgramContext {
    static from(connection, wallet, programId, opts = anchor_1.AnchorProvider.defaultOptions()) {
        const anchorProvider = new anchor_1.AnchorProvider(connection, wallet, opts);
        const program = new anchor_1.Program(paylater_json_1.default, programId, anchorProvider);
        return new ProgramContext(anchorProvider, anchorProvider.wallet, program, opts);
    }
    constructor(provider, wallet, program, opts) {
        this.connection = provider.connection;
        this.wallet = wallet;
        this.opts = opts;
        // It's a hack but it works on Anchor workspace *shrug*
        this.program = program;
        this.provider = provider;
        this.ixs = new ix_1.ProgramIx(this);
    }
}
exports.ProgramContext = ProgramContext;
