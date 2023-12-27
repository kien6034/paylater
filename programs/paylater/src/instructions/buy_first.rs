use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use whirlpool::cpi::accounts::Swap;
use whirlpool::program::Whirlpool as WhirlpoolProgram;
use whirlpool::state::{ Whirlpool, TickArray };

use whirlpool::{ self };

use crate::{ CONTRACT, USER_INFO };
use crate::errors::ErrorCode;
use crate::state::{ Market, User, Contract };

pub fn buy_first(
    ctx: Context<BuyFirst>,
    amount: u64,
    other_amount_threshold: u64,
    sqrt_price_limit: u128
) -> Result<(), ProgramError> {
    let market = &ctx.accounts.market;
    let whirlpool = &ctx.accounts.whirlpool;
    let contract = &mut ctx.accounts.contract;
    let user_info = &mut ctx.accounts.user_info;

    let token_owner_account_a;
    let token_owner_account_b;

    // TODO: validate this
    // Swap bond -> access
    let a_to_b;
    let amount_specified_is_input = true;
    if market.bond_token.eq(&whirlpool.token_mint_a) {
        token_owner_account_a = ctx.accounts.bond_token_vault.clone();
        token_owner_account_b = ctx.accounts.access_token_vault.clone();

        a_to_b = true; // bond is token a -> a->b
    } else if market.bond_token.eq(&whirlpool.token_mint_b) {
        token_owner_account_a = ctx.accounts.access_token_vault.clone();
        token_owner_account_b = ctx.accounts.bond_token_vault.clone();

        a_to_b = false; // bond is token b -> b->a
    } else {
        return Err(ErrorCode::TokenMismatched.into());
    }

    let token_authority = &market;

    // update user info current contract id
    user_info.current_contract_id += 1;

    // TODO: cannot use orcal swap function to calculate this, since it will change the state
    // Record swap info into contract
    // let clock = Clock::get()?;
    // let timestamp = to_timestamp_u64(clock.unix_timestamp)?;

    // let tick_array_0 = ctx.accounts.tick_array_0.clone();
    // let tick_array_1 = ctx.accounts.tick_array_1.clone();
    // let tick_array_2 = ctx.accounts.tick_array_2.clone();
    // let mut swap_tick_sequence = SwapTickSequence::new(
    //     tick_array_0.load_mut().unwrap(),
    //     tick_array_1.load_mut().ok(),
    //     tick_array_2.load_mut().ok()
    // );

    // let swap_update = swap(
    //     &whirlpool,
    //     &mut swap_tick_sequence,
    //     amount,
    //     sqrt_price_limit,
    //     amount_specified_is_input,
    //     a_to_b,
    //     timestamp
    // )?;
    // msg!("swap_update: {:?}", swap_update);

    contract.initialize(
        user_info.current_contract_id,
        market.bond_token,
        market.access_token,
        amount,
        other_amount_threshold
    )?;

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
    msg!("Calling swap");
    whirlpool::cpi::swap(
        cpi_ctx,
        amount,
        other_amount_threshold,
        sqrt_price_limit,
        amount_specified_is_input,
        a_to_b
    )?;
    msg!("Finish swap");

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

    // Init contract
    #[account(
        mut,
        seeds = [USER_INFO.as_ref(), market.market_id.as_ref(), user.key.as_ref()], bump,
    )]
    pub user_info: Account<'info, User>,

    #[account(
        init,
        payer = user,
        space = Contract::LEN,
        seeds = [
            CONTRACT.as_ref(),
            market.market_id.as_ref(),
            user.key.as_ref(),
            user_info.current_contract_id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub contract: Account<'info, Contract>,

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
