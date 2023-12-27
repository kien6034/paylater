use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub market_id: String,
    pub initializer: Pubkey,
    pub bond_token: Pubkey,
    pub access_token: Pubkey,
    pub bond_token_vault: Pubkey,
    pub access_token_vault: Pubkey,
    pub market_bump: [u8; 1],
}

impl Market {
    pub const LEN: usize = 8 + 100 + 32 * 5 + 1;

    pub fn market_seeds(&self) -> [&[u8]; 3] {
        [b"market", self.market_id.as_ref(), self.market_bump.as_ref()]
    }
}
