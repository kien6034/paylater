use std::fmt::Error;

use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount };
use whirlpool::cpi::accounts::Swap;
use whirlpool::program::Whirlpool as WhirlpoolProgram;
use whirlpool::state::{ Whirlpool, TickArray };
use whirlpool::util::SwapTickSequence;
use whirlpool::manager::swap_manager::swap;
use whirlpool::{ self };

use crate::errors::ErrorCode;
use crate::state::Market;

pub fn buy_first(
    ctx: Context<BuyFirst>,
    amount: u64,
    other_amount_threshold: u64,
    sqrt_price_limit: u128
) -> Result<(), ProgramError> {
    let market = &ctx.accounts.market;
    let whirlpool = &mut ctx.accounts.whirlpool;

    let mut token_owner_account_a = &mut ctx.accounts.token_owner_account_a;
    let mut token_owner_account_b = &mut ctx.accounts.token_owner_account_b;

    // TODO: validate this
    // Swap bond -> access
    let a_to_b;
    let amount_specified_is_input = true;
    if market.bond_token.eq(&whirlpool.token_mint_a) {
        token_owner_account_a = &mut ctx.accounts.bond_token_vault;
        token_owner_account_b = &mut ctx.accounts.access_token_vault;

        a_to_b = true; // bond is token a -> a->b
    } else {
        token_owner_account_a = &mut ctx.accounts.access_token_vault;
        token_owner_account_b = &mut ctx.accounts.bond_token_vault;

        a_to_b = false; // bond is token b -> b->a
    }
    let token_authority = &market;

    // Get swap update
    let clock = Clock::get()?;
    let timestamp = to_timestamp_u64(clock.unix_timestamp)?;
    let mut swap_tick_sequence = SwapTickSequence::new(
        ctx.accounts.tick_array_0.load_mut().unwrap(),
        ctx.accounts.tick_array_1.load_mut().ok(),
        ctx.accounts.tick_array_2.load_mut().ok()
    );

    let swap_update = swap(
        &whirlpool,
        &mut swap_tick_sequence,
        amount,
        sqrt_price_limit,
        amount_specified_is_input,
        a_to_b,
        timestamp
    )?;

    // Record swap info

    // Call nemoswap
    let cpi_program = ctx.accounts.whirlpool_program.to_account_info().clone();
    let cpi_accounts = Swap {
        token_program: ctx.accounts.token_program.to_account_info(),
        token_authority: token_authority.to_account_info(),
        whirlpool: ctx.accounts.whirlpool.to_account_info(),
        token_owner_account_a: token_owner_account_a.to_account_info(),
        token_vault_a: ctx.accounts.token_vault_a.to_account_info(),
        token_owner_account_b: token_owner_account_b.to_account_info(),
        token_vault_b: ctx.accounts.token_vault_b.to_account_info(),
        tick_array_0: ctx.accounts.tick_array_0.to_account_info(),
        tick_array_1: ctx.accounts.tick_array_1.to_account_info(),
        tick_array_2: ctx.accounts.tick_array_2.to_account_info(),
        oracle: ctx.accounts.oracle.to_account_info(),
    };

    let binding = [&market.market_seeds()[..]];
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &binding);

    // do cpi call
    whirlpool::cpi::swap(
        cpi_ctx,
        amount,
        other_amount_threshold,
        sqrt_price_limit,
        amount_specified_is_input,
        a_to_b
    );
    Ok(())
}

#[derive(Accounts)]
pub struct BuyFirst<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub market: Account<'info, Market>,

    #[account(mut, address=market.bond_token_vault)]
    pub bond_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, address=market.access_token_vault)]
    pub access_token_vault: Box<Account<'info, TokenAccount>>,

    /// nemo data
    pub whirlpool_program: Program<'info, WhirlpoolProgram>,
    #[account(mut)]
    pub whirlpool: Box<Account<'info, Whirlpool>>,

    #[account(mut, constraint = token_owner_account_a.mint == whirlpool.token_mint_a)]
    pub token_owner_account_a: Box<Account<'info, TokenAccount>>,
    #[account(mut, address = whirlpool.token_vault_a)]
    pub token_vault_a: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_owner_account_b.mint == whirlpool.token_mint_b)]
    pub token_owner_account_b: Box<Account<'info, TokenAccount>>,
    #[account(mut, address = whirlpool.token_vault_b)]
    pub token_vault_b: Box<Account<'info, TokenAccount>>,

    #[account(mut, has_one = whirlpool)]
    pub tick_array_0: AccountLoader<'info, TickArray>,

    #[account(mut, has_one = whirlpool)]
    pub tick_array_1: AccountLoader<'info, TickArray>,

    #[account(mut, has_one = whirlpool)]
    pub tick_array_2: AccountLoader<'info, TickArray>,

    // #[account(seeds = [b"oracle", whirlpool.key().as_ref()], bump)]
    /// CHECK: This is not dangerous
    pub oracle: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}

pub fn to_timestamp_u64(t: i64) -> Result<u64, ErrorCode> {
    u64::try_from(t).or(Err(ErrorCode::InternalError))
}
