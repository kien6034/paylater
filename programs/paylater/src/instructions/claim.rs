use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use crate::{
    state::{ Market, Contract },
    util::{ transfer_from_user_to_vault, transfer_from_vault_to_user },
    errors::ErrorCode,
};

pub fn claim(ctx: Context<Claim>, amount: u64) -> Result<(), ProgramError> {
    let market = &ctx.accounts.market;
    let contract = &mut ctx.accounts.contract;

    // TODO: use check to handle overflow
    // calculate bond amount need to pay
    let repay_amount = (contract.total_bond_amount * amount) / contract.total_access_amount;

    contract.bond_amount_paid += repay_amount;
    contract.access_amount_paid += amount;

    if
        contract.bond_amount_paid > contract.total_bond_amount ||
        contract.access_amount_paid > contract.total_access_amount
    {
        return Err(ErrorCode::TokenClaimExceed.into());
    }

    // transfer bond token from user to vault
    transfer_from_user_to_vault(
        &ctx.accounts.user,
        &ctx.accounts.user_bond_token_account.to_account_info(),
        &ctx.accounts.bond_token_vault.to_account_info(),
        &ctx.accounts.token_program.to_account_info(),
        repay_amount
    )?;

    // transfer access token from vault to user
    transfer_from_vault_to_user(
        &ctx.accounts.market.to_account_info(),
        &ctx.accounts.access_token_vault.to_account_info(),
        &ctx.accounts.user_access_token_account.to_account_info(),
        &ctx.accounts.token_program.to_account_info(),
        amount,
        &[&market.market_seeds()]
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub market: Account<'info, Market>,

    #[account(
      mut, constraint = contract.bond_token_mint.key() == market.bond_token.key(), constraint = contract.access_token_mint.key() == market.access_token.key()
  )]
    pub contract: Account<'info, Contract>,

    #[account(mut, address=market.bond_token_vault)]
    pub bond_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, address=market.access_token_vault)]
    pub access_token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub user_bond_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub user_access_token_account: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}
