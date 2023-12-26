use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount };
use crate::{ state::Market, MARKET_PDA_SEED, BOND_TOKEN_VAULT_SEED, ACCESS_TOKEN_VAULT_SEED };

pub fn initialize(
    ctx: Context<Initialize>,
    market_id: String,
    market_bump: u8
) -> Result<(), ProgramError> {
    let market = &mut ctx.accounts.market;

    market.marketId = market_id;
    market.initializer = *ctx.accounts.initializer.key;
    market.bond_token = *ctx.accounts.bond_token_mint.to_account_info().key;
    market.access_token = *ctx.accounts.access_token_mint.to_account_info().key;
    market.bond_token_vault = *ctx.accounts.bond_token_vault.to_account_info().key;
    market.access_token_vault = *ctx.accounts.access_token_vault.to_account_info().key;

    market.market_bump = [market_bump];

    Ok(())
}

#[derive(Accounts)]
#[instruction(market_id: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,

    /// CHECK: this is store account signer
    #[account(mut)]
    pub signer: AccountInfo<'info>,
    pub bond_token_mint: Account<'info, Mint>,
    pub access_token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = initializer,
        space = Market::LEN,
        seeds = [MARKET_PDA_SEED.as_ref(), market_id.as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        init,
        payer = initializer,
        seeds = [BOND_TOKEN_VAULT_SEED, market_id.as_ref()],
        bump,
        token::mint = bond_token_mint,
        token::authority = market
    )]
    pub bond_token_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = initializer,
        seeds = [ACCESS_TOKEN_VAULT_SEED, market_id.as_ref()],
        bump,
        token::mint = access_token_mint,
        token::authority = market
    )]
    pub access_token_vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}
