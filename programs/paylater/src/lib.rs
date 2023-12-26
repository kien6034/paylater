use anchor_lang::prelude::*;

declare_id!("23vrxqS7BLen7q9HVyy5X7JJhT8L9SBjnVqjftWBZ7BQ");

pub const MARKET_PDA_SEED: &[u8] = b"market";
pub const MARKET_VAULT_PDA_SEED: &[u8] = b"market_vault";

pub mod instructions;
pub mod state;
pub mod util;
pub mod errors;

use instructions::*;

#[program]
pub mod paylater {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, market_bump: u8) -> Result<(), ProgramError> {
        instructions::init_market::initialize(ctx, market_bump)
    }

    pub fn lock_token(ctx: Context<LockToken>, amount: u64) -> Result<(), ProgramError> {
        instructions::lock_token::lock_token(ctx, amount)
    }

    pub fn unlock_token(
        ctx: Context<UnlockToken>,
        tx_id: String,
        amount: u64,
        sig: [u8; 64]
    ) -> Result<(), ProgramError> {
        instructions::unlock_token::unlock_token(ctx, tx_id, amount, sig)
    }

    pub fn buy_first(
        ctx: Context<BuyFirst>,
        amount: u64,
        other_amount_threshold: u64,
        sqrt_price_limit: u128,
        amount_specified_is_input: bool,
        a_to_b: bool
    ) -> Result<(), ProgramError> {
        instructions::buy_first::buy_first(
            ctx,
            amount,
            other_amount_threshold,
            sqrt_price_limit,
            amount_specified_is_input,
            a_to_b
        )
    }
}
