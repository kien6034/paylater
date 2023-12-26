use anchor_lang::prelude::*;
use anchor_spl::token::{ self, InitializeAccount, Token, Transfer };

pub fn transfer_from_user_to_vault<'info>(
    owner_authority: &Signer<'info>,
    user_token_account: &AccountInfo<'info>,
    token_vault: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    amount: u64
) -> Result<(), ProgramError> {
    token::transfer(
        CpiContext::new(token_program.to_account_info(), Transfer {
            from: user_token_account.to_account_info(),
            to: token_vault.to_account_info(),
            authority: owner_authority.to_account_info(),
        }),
        amount
    )
}

pub fn transfer_from_vault_to_user<'info>(
    authority: AccountInfo<'info>,
    token_vault: &AccountInfo<'info>,
    user_token_account: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    amount: u64,
    seed: &[&[&[u8]]]
) -> Result<(), ProgramError> {
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: token_vault.to_account_info(),
                to: user_token_account.to_account_info(),
                authority: authority.to_account_info(),
            },
            seed
        ),
        amount
    )
}

pub fn initialize_token_account<'info>(
    account: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    authority: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    rent: &Sysvar<'info, Rent>
) -> Result<(), ProgramError> {
    let cpi_accounts = InitializeAccount {
        account: account.to_account_info(),
        mint: mint.to_account_info(),
        authority: authority.to_account_info(),
        rent: rent.to_account_info(),
    };

    let cpi_program = token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::initialize_account(cpi_ctx)?;
    Ok(())
}
