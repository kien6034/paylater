use anchor_lang::prelude::*;
use crate::{ state::{ Market, User }, USER_INFO };

pub fn init_user_info(ctx: Context<InitUserInfo>) -> Result<(), ProgramError> {
    let user_info = &mut ctx.accounts.user_info;

    user_info.current_contract_id = 1;

    Ok(())
}

#[derive(Accounts)]
pub struct InitUserInfo<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
       mut
    )]
    pub market: Account<'info, Market>,

    #[account(
        init,
        payer = user,
        space = User::LEN,
        seeds = [USER_INFO, market.market_id.as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, User>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
}
