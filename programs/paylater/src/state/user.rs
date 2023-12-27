use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub current_contract_id: u64,
}

impl User {
    pub const LEN: usize = 8 + 8;
}
