use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount };
use crate::{ state::Market, MARKET_PDA_SEED, MARKET_VAULT_PDA_SEED };

pub fn initialize(ctx: Context<Initialize>, market_bump: u8) -> Result<(), ProgramError> {
    let market = &mut ctx.accounts.market;

    market.initializer = *ctx.accounts.initializer.key;
    market.token_mint = *ctx.accounts.token_mint.to_account_info().key;
    market.token_vault = *ctx.accounts.token_vault.to_account_info().key;
    market.signer = *ctx.accounts.initializer.key;
    market.market_bump = [market_bump];

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,

    /// CHECK: this is store account signer
    #[account(mut)]
    pub signer: AccountInfo<'info>,
    pub token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = initializer,
        space = Market::LEN,
        seeds = [MARKET_PDA_SEED.as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        init,
        payer = initializer,
        seeds = [MARKET_VAULT_PDA_SEED, token_mint.key().as_ref()],
        bump,
        token::mint = token_mint,
        token::authority = market
    )]
    pub token_vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}
