import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const MARKET_SEED = "market";
const BOND_TOKEN_VAULT_SEED = "market_bond_token_vault";
const ACCESS_TOKEN_VAULT_SEED = "market_access_token_vault";
const USER_INFO = "user_info";
const CONTRACT = "contract";

export interface PDAInfo {
  key: anchor.web3.PublicKey;
  bump: number;
}

export class PDA {
  readonly programId: anchor.web3.PublicKey;
  readonly bondTokenMint: PublicKey;
  readonly accessTokenMint: PublicKey;
  readonly marketId: string;

  public constructor(
    programId: anchor.web3.PublicKey,
    marketId: string,
    bondTokenMint: PublicKey,
    accessTokenMint: PublicKey
  ) {
    this.programId = programId;
    this.bondTokenMint = bondTokenMint;
    this.accessTokenMint = accessTokenMint;
    this.marketId = marketId;
  }

  public getUserInfoPDA = (user: PublicKey): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(USER_INFO),
        anchor.utils.bytes.utf8.encode(this.marketId),
        user.toBuffer(),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  public getContractPDA = (user: PublicKey, contractId: anchor.BN): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(CONTRACT),
        anchor.utils.bytes.utf8.encode(this.marketId),
        user.toBuffer(),
        contractId.toArrayLike(Buffer, "le", 8),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  public getMarketPDA = (): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(MARKET_SEED),
        anchor.utils.bytes.utf8.encode(this.marketId),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  public getBondTokenVaultPDA = (): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(BOND_TOKEN_VAULT_SEED),
        anchor.utils.bytes.utf8.encode(this.marketId),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  public getAccessTokenVaultPDA = (): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(ACCESS_TOKEN_VAULT_SEED),
        anchor.utils.bytes.utf8.encode(this.marketId),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };
}
