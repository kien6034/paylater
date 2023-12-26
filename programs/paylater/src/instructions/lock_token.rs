use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount };
use crate::{ state::Market, MARKET_PDA_SEED, MARKET_VAULT_PDA_SEED };
use crate::util::token::transfer_from_user_to_vault;

pub fn lock_token(ctx: Context<LockToken>, amount: u64) -> Result<(), ProgramError> {
    let user = &ctx.accounts.user;
    let user_token_account = &ctx.accounts.user_token_account;
    let token_vault = &ctx.accounts.token_vault;
    let token_program = &ctx.accounts.token_program;

    transfer_from_user_to_vault(
        user,
        &user_token_account.to_account_info(),
        &token_vault.to_account_info(),
        &token_program.to_account_info(),
        amount
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct LockToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,

    #[account(mut, seeds = [MARKET_PDA_SEED, token_mint.key().as_ref()], bump)]
    pub market: Account<'info, Market>,

    #[account(mut, seeds = [MARKET_VAULT_PDA_SEED, token_mint.key().as_ref()], bump)]
    pub token_vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}
