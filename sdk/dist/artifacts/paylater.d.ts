export type Paylater = {
    "version": "0.1.0";
    "name": "paylater";
    "instructions": [
        {
            "name": "initialize";
            "accounts": [
                {
                    "name": "initializer";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "signer";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "bondTokenMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "accessTokenMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "market";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "bondTokenVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "accessTokenVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "marketId";
                    "type": "string";
                },
                {
                    "name": "marketBump";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "buyFirst";
            "accounts": [
                {
                    "name": "user";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "userTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "whirlpoolProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "whirlpool";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenOwnerAccountA";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenVaultA";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenOwnerAccountB";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenVaultB";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tickArray0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tickArray1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tickArray2";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "oracle";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                },
                {
                    "name": "otherAmountThreshold";
                    "type": "u64";
                },
                {
                    "name": "sqrtPriceLimit";
                    "type": "u128";
                },
                {
                    "name": "amountSpecifiedIsInput";
                    "type": "bool";
                },
                {
                    "name": "aToB";
                    "type": "bool";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "market";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "marketId";
                        "type": "string";
                    },
                    {
                        "name": "initializer";
                        "type": "publicKey";
                    },
                    {
                        "name": "bondToken";
                        "type": "publicKey";
                    },
                    {
                        "name": "accessToken";
                        "type": "publicKey";
                    },
                    {
                        "name": "bondTokenVault";
                        "type": "publicKey";
                    },
                    {
                        "name": "accessTokenVault";
                        "type": "publicKey";
                    },
                    {
                        "name": "marketBump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    }
                ];
            };
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "NumberCastError";
            "msg": "Number Cast Error";
        },
        {
            "code": 6001;
            "name": "SigFailed";
            "msg": "Sig Failed";
        }
    ];
};
export declare const IDL: Paylater;
