use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub initializer: Pubkey,
    pub token_mint: Pubkey,
    pub token_vault: Pubkey,
    pub signer: Pubkey,
    pub market_bump: [u8; 1],
}

impl Market {
    pub const LEN: usize = 8 + 32 * 4 + 1;

    pub fn market_seeds(&self) -> [&[u8]; 3] {
        [b"market", &self.token_mint.as_ref(), self.market_bump.as_ref()]
    }
}
