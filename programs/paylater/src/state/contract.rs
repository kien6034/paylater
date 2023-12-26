use anchor_lang::prelude::*;

#[account]
pub struct Contract {}

impl Contract {
    pub const LEN: usize = 8 + 100 + 32 * 5 + 1;
}
