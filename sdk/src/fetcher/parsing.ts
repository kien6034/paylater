import { BorshAccountsCoder } from "@project-serum/anchor";
import { AccountName, MarketData, PROGRAM_CODER } from "../types";

/**
 * Static abstract class definition to parse entities.
 * @category Parsables
 */
export interface ParsableEntity<T> {
  /**
   * Parse account data
   *
   * @param accountData Buffer data for the entity
   * @returns Parsed entity
   */
  parse: (accountData: Buffer | undefined | null) => T | null;
}

@staticImplements<ParsableEntity<MarketData>>()
export class ParsableMarket {
  private constructor() {}

  public static parse(data: Buffer | undefined | null): MarketData | null {
    if (!data) {
      return null;
    }

    try {
      return parseAnchorAccount(AccountName.Market, data);
    } catch (e) {
      console.error(`error while parsing WhirlpoolsConfig: ${e}`);
      return null;
    }
  }
}

/**
 * Class decorator to define an interface with static methods
 * Reference: https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-295685298
 */
function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

function parseAnchorAccount(accountName: AccountName, data: Buffer) {
  const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
  if (discriminator.compare(data.slice(0, 8))) {
    console.error("incorrect account name during parsing");
    return null;
  }

  try {
    return PROGRAM_CODER.decode(accountName, data);
  } catch (_e) {
    console.error("unknown account name during parsing");
    return null;
  }
}
