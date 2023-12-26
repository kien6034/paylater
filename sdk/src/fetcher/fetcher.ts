import { Connection, PublicKey } from "@solana/web3.js";
import { Address, translateAddress } from "@project-serum/anchor";
import { AccountLayout } from "@solana/spl-token";
import invariant from "tiny-invariant";
import {} from "../";
import { ParsableEntity, ParsableMarket } from "./parsing";
import { MarketData } from "../types";

/**
 * Supported accounts
 */
export type CachedValue = MarketData;

/**
 * Include both the entity (i.e. type) of the stored value, and the value itself
 */
export interface CachedContent<T extends CachedValue> {
  entity: ParsableEntity<T>;
  value: CachedValue | null;
}

/**
 * Type for rpc batch request response
 */
type GetMultipleAccountsResponse = {
  error?: string;
  result?: {
    value?: ({ data: [string, string] } | null)[];
  };
};

export class AccountFetcher {
  private readonly connection: Connection;
  private readonly _cache: Record<string, CachedContent<CachedValue>> = {};
  private _tokenAccountRentExempt: number | undefined;

  constructor(
    connection: Connection,
    cache?: Record<string, CachedContent<CachedValue>>
  ) {
    this.connection = connection;
    this._cache = cache ?? {};
  }

  /*** Public Methods ***/

  /**
   * Retrieve minimum balance for rent exemption of a Token Account;
   *
   * @param refresh force refresh of account rent exemption
   * @returns minimum balance for rent exemption
   */
  public async getTokenAccountRentExempt(refresh: boolean = false) {
    // This value should be relatively static or at least not break according to spec
    // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
    if (!this._tokenAccountRentExempt || refresh) {
      this._tokenAccountRentExempt =
        await this.connection.getMinimumBalanceForRentExemption(
          AccountLayout.span
        );
    }
    return this._tokenAccountRentExempt;
  }

  public async getMarket(
    address: Address,
    refresh = false
  ): Promise<MarketData | null> {
    return this.get(translateAddress(address), ParsableMarket, refresh);
  }

  /**
   * Update the cached value of all entities currently in the cache.
   * Uses batched rpc request for network efficient fetch.
   */
  public async refreshAll(): Promise<void> {
    const addresses: string[] = Object.keys(this._cache);
    const data = await this.bulkRequest(addresses);

    for (const [idx, [key, cachedContent]] of Object.entries(
      this._cache
    ).entries()) {
      const entity = cachedContent.entity;
      const value = entity.parse(data[idx]);

      this._cache[key] = { entity, value };
    }
  }

  /*** Private Methods ***/

  /**
   * Retrieve from cache or fetch from rpc, an account
   */
  private async get<T extends CachedValue>(
    address: PublicKey,
    entity: ParsableEntity<T>,
    refresh: boolean
  ): Promise<T | null> {
    const key = address.toBase58();
    const cachedValue: CachedValue | null | undefined = this._cache[key]?.value;

    if (cachedValue !== undefined && !refresh) {
      return cachedValue as T | null;
    }

    const accountInfo = await this.connection.getAccountInfo(address);
    const accountData = accountInfo?.data;
    const value = entity.parse(accountData);
    this._cache[key] = { entity, value };

    return value;
  }

  /**
   * Retrieve from cache or fetch from rpc, a list of accounts
   */
  private async list<T extends CachedValue>(
    addresses: PublicKey[],
    entity: ParsableEntity<T>,
    refresh: boolean
  ): Promise<(T | null)[]> {
    const keys = addresses.map((address) => address.toBase58());
    const cachedValues: [string, CachedValue | null | undefined][] = keys.map(
      (key) => [key, refresh ? undefined : this._cache[key]?.value]
    );

    /* Look for accounts not found in cache */
    const undefinedAccounts: { cacheIndex: number; key: string }[] = [];
    cachedValues.forEach(([key, value], cacheIndex) => {
      if (value === undefined) {
        undefinedAccounts.push({ cacheIndex, key });
      }
    });

    /* Fetch accounts not found in cache */
    if (undefinedAccounts.length > 0) {
      const data = await this.bulkRequest(
        undefinedAccounts.map((account) => account.key)
      );
      undefinedAccounts.forEach(({ cacheIndex, key }, dataIndex) => {
        const value = entity.parse(data[dataIndex]);
        invariant(
          cachedValues[cacheIndex]?.[1] === undefined,
          "unexpected non-undefined value"
        );
        cachedValues[cacheIndex] = [key, value];
        this._cache[key] = { entity, value };
      });
    }

    const result = cachedValues
      .map(([_, value]) => value)
      .filter((value): value is T | null => value !== undefined);
    invariant(result.length === addresses.length, "not enough results fetched");
    return result;
  }

  /**
   * Make batch rpc request
   */
  private async bulkRequest(addresses: string[]): Promise<(Buffer | null)[]> {
    const responses: Promise<GetMultipleAccountsResponse>[] = [];
    const chunk = 100; // getMultipleAccounts has limitation of 100 accounts per request

    for (let i = 0; i < addresses.length; i += chunk) {
      const addressesSubset = addresses.slice(i, i + chunk);
      const res = (this.connection as any)._rpcRequest("getMultipleAccounts", [
        addressesSubset,
        { commitment: this.connection.commitment },
      ]);
      responses.push(res);
    }

    const combinedResult: (Buffer | null)[] = [];

    (await Promise.all(responses)).forEach((res) => {
      invariant(!res.error, `bulkRequest result error: ${res.error}`);
      invariant(!!res.result?.value, "bulkRequest no value");

      res.result.value.forEach((account) => {
        if (!account || account.data[1] !== "base64") {
          combinedResult.push(null);
        } else {
          combinedResult.push(Buffer.from(account.data[0], account.data[1]));
        }
      });
    });

    invariant(
      combinedResult.length === addresses.length,
      "bulkRequest not enough results"
    );
    return combinedResult;
  }
}
