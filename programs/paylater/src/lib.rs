use anchor_lang::prelude::*;

declare_id!("23vrxqS7BLen7q9HVyy5X7JJhT8L9SBjnVqjftWBZ7BQ");

pub const MARKET_PDA_SEED: &[u8] = b"market";
pub const BOND_TOKEN_VAULT_SEED: &[u8] = b"market_bond_token_vault";
pub const ACCESS_TOKEN_VAULT_SEED: &[u8] = b"market_access_token_vault";
pub const USER_INFO: &[u8] = b"user_info";
pub const CONTRACT: &[u8] = b"contract";

pub mod instructions;
pub mod state;
pub mod util;
pub mod errors;

use instructions::*;

#[program]
pub mod paylater {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        market_id: String,
        market_bump: u8
    ) -> Result<(), ProgramError> {
        instructions::init_market::initialize(ctx, market_id, market_bump)
    }

    pub fn init_user_info(ctx: Context<InitUserInfo>) -> Result<(), ProgramError> {
        instructions::init_user_info::init_user_info(ctx)
    }

    pub fn buy_first(
        ctx: Context<BuyFirst>,
        amount: u64,
        other_amount_threshold: u64,
        sqrt_price_limit: u128
    ) -> Result<(), ProgramError> {
        instructions::buy_first::buy_first(ctx, amount, other_amount_threshold, sqrt_price_limit)
    }
}
