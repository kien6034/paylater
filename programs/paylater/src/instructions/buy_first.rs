use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount };
use whirlpool::cpi::accounts::Swap;
use whirlpool::program::Whirlpool as WhirlpoolProgram;
use whirlpool::state::{ Whirlpool, TickArray };
use whirlpool::{ self };

use crate::{ state::Market };
use crate::util::token::transfer_from_user_to_vault;

pub fn buy_first(
    ctx: Context<BuyFirst>,
    amount: u64,
    other_amount_threshold: u64,
    sqrt_price_limit: u128,
    amount_specified_is_input: bool,
    a_to_b: bool
) -> Result<(), ProgramError> {
    let cpi_program = ctx.accounts.whirlpool_program.to_account_info().clone();
    let cpi_accounts = Swap {
        token_program: ctx.accounts.token_program.to_account_info(),
        token_authority: ctx.accounts.user.to_account_info(),
        whirlpool: ctx.accounts.whirlpool.to_account_info(),
        token_owner_account_a: ctx.accounts.token_owner_account_a.to_account_info(),
        token_vault_a: ctx.accounts.token_vault_a.to_account_info(),
        token_owner_account_b: ctx.accounts.token_owner_account_b.to_account_info(),
        token_vault_b: ctx.accounts.token_vault_b.to_account_info(),
        tick_array_0: ctx.accounts.tick_array_0.to_account_info(),
        tick_array_1: ctx.accounts.tick_array_1.to_account_info(),
        tick_array_2: ctx.accounts.tick_array_2.to_account_info(),
        oracle: ctx.accounts.oracle.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

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
    pub user_token_account: Account<'info, TokenAccount>,

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
