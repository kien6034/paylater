use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions::{
    load_current_index_checked,
    ID as IX_ID,
    load_instruction_at_checked,
};
use anchor_spl::token::{ Mint, TokenAccount, self };
use crate::errors::ErrorCode;
use crate::util::{ get_message_bytes, verify_ed25519_ix };
use crate::{ state::Market, MARKET_PDA_SEED, MARKET_VAULT_PDA_SEED };
use crate::util::token::transfer_from_vault_to_user;

pub fn unlock_token(
    ctx: Context<UnlockToken>,
    tx_id: String,
    amount: u64,
    sig: [u8; 64]
) -> Result<(), ProgramError> {
    let user = &ctx.accounts.user;
    let user_token_account = &ctx.accounts.user_token_account;
    let token_vault = &ctx.accounts.token_vault;
    let token_program = &ctx.accounts.token_program;
    let market = &ctx.accounts.market;
    let token_mint = &ctx.accounts.token_mint;

    // CHECK if the signature has been used
    let msg = get_message_bytes(tx_id, user.key(), token_mint.key(), amount);
    let pk = market.signer.to_bytes();
    let current_idx = load_current_index_checked(&ctx.accounts.ix_sysvar)?;
    let sig_idx = current_idx.checked_sub(1).ok_or(ErrorCode::NumberCastError)?;

    let ix = load_instruction_at_checked(sig_idx as usize, &ctx.accounts.ix_sysvar)?;
    verify_ed25519_ix(&ix, &pk, &msg, &sig)?;

    transfer_from_vault_to_user(
        user.to_account_info(),
        &user_token_account.to_account_info(),
        &token_vault.to_account_info(),
        &token_program.to_account_info(),
        amount,
        &[&market.market_seeds()]
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct UnlockToken<'info> {
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

    /// CHECK: unchecked
    /// The address check is needed because otherwise
    /// the supplied Sysvar could be anything else.
    /// The Instruction Sysvar has not been implemented
    /// in the Anchor framework yet, so this is the safe approach.
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
}
