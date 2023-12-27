export type Paylater = {
  "version": "0.1.0",
  "name": "paylater",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "string"
        },
        {
          "name": "marketBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initUserInfo",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyFirst",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimit",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contractId",
            "type": "u64"
          },
          {
            "name": "bondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "accessTokenMint",
            "type": "publicKey"
          },
          {
            "name": "bondAmount",
            "type": "u64"
          },
          {
            "name": "totalBondAmount",
            "type": "u64"
          },
          {
            "name": "totalAccessAmount",
            "type": "u64"
          },
          {
            "name": "bondAmountPaid",
            "type": "u64"
          },
          {
            "name": "accessAmountPaid",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "string"
          },
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "bondToken",
            "type": "publicKey"
          },
          {
            "name": "accessToken",
            "type": "publicKey"
          },
          {
            "name": "bondTokenVault",
            "type": "publicKey"
          },
          {
            "name": "accessTokenVault",
            "type": "publicKey"
          },
          {
            "name": "marketBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentContractId",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumberCastError",
      "msg": "Number Cast Error"
    },
    {
      "code": 6001,
      "name": "SigFailed",
      "msg": "Sig Failed"
    },
    {
      "code": 6002,
      "name": "InternalError",
      "msg": "Internal Error"
    },
    {
      "code": 6003,
      "name": "TokenMismatched",
      "msg": "Token Mismatched"
    }
  ]
};

export const IDL: Paylater = {
  "version": "0.1.0",
  "name": "paylater",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "string"
        },
        {
          "name": "marketBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initUserInfo",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyFirst",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "accessTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whirlpoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whirlpool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArray2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimit",
          "type": "u128"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contractId",
            "type": "u64"
          },
          {
            "name": "bondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "accessTokenMint",
            "type": "publicKey"
          },
          {
            "name": "bondAmount",
            "type": "u64"
          },
          {
            "name": "totalBondAmount",
            "type": "u64"
          },
          {
            "name": "totalAccessAmount",
            "type": "u64"
          },
          {
            "name": "bondAmountPaid",
            "type": "u64"
          },
          {
            "name": "accessAmountPaid",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "string"
          },
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "bondToken",
            "type": "publicKey"
          },
          {
            "name": "accessToken",
            "type": "publicKey"
          },
          {
            "name": "bondTokenVault",
            "type": "publicKey"
          },
          {
            "name": "accessTokenVault",
            "type": "publicKey"
          },
          {
            "name": "marketBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentContractId",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumberCastError",
      "msg": "Number Cast Error"
    },
    {
      "code": 6001,
      "name": "SigFailed",
      "msg": "Sig Failed"
    },
    {
      "code": 6002,
      "name": "InternalError",
      "msg": "Internal Error"
    },
    {
      "code": 6003,
      "name": "TokenMismatched",
      "msg": "Token Mismatched"
    }
  ]
};
