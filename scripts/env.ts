require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  PROGRAM_ID:
    process.env.PROGRAM_ID || "23vrxqS7BLen7q9HVyy5X7JJhT8L9SBjnVqjftWBZ7BQ",
  TOKEN_MINT:
    process.env.TOKEN_MINT || "AQTj1uAnkL38ahGUEFNvjgvth2q47FeTMtJVJRmcZQrX",
};
