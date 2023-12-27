require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  PROGRAM_ID:
    process.env.PROGRAM_ID || "23vrxqS7BLen7q9HVyy5X7JJhT8L9SBjnVqjftWBZ7BQ",
  BOND_TOKEN_MINT:
    process.env.TOKEN_MINT || "CmSDGrYosFPy6eALXw4ZsZnyZfkm6SpTXpBjCVwee3GH",
  ACCESS_TOKEN_MINT:
    process.env.TOKEN_MINT || "CrGAYiZ2SabksWjeZRHRHWyW51wbhhERyAhhew5er5t4",
  MARKET_ID: process.env.MARKET_ID || "02",
};
