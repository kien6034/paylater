"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "swap_on_off",
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
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
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
                    "name": "marketBump",
                    "type": "u8"
                }
            ],
            "returns": {
                "defined": "ProgramError"
            }
        },
        {
            "name": "lockToken",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
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
                    "name": "amount",
                    "type": "u64"
                }
            ],
            "returns": {
                "defined": "ProgramError"
            }
        },
        {
            "name": "unlockToken",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
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
                    "name": "amount",
                    "type": "u64"
                }
            ],
            "returns": {
                "defined": "ProgramError"
            }
        }
    ],
    "accounts": [
        {
            "name": "market",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "initializer",
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenMint",
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenVault",
                        "type": "publicKey"
                    },
                    {
                        "name": "signer",
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
        }
    ]
};
