use anchor_lang::prelude::*;

#[account]
pub struct Contract {
    pub contract_id: u64,
    pub bond_token_mint: Pubkey,
    pub access_token_mint: Pubkey,
    pub bond_amount: u64,
    pub total_bond_amount: u64,
    pub total_access_amount: u64,
    pub bond_amount_paid: u64,
    pub access_amount_paid: u64,
}

impl Contract {
    pub const LEN: usize = 8 + 32 * 2 + 8 * 6;

    pub fn initialize(
        &mut self,
        contract_id: u64,
        bond_token_mint: Pubkey,
        access_token_mint: Pubkey,
        bond_amount: u64,
        access_amount: u64
    ) -> ProgramResult {
        self.contract_id = contract_id;
        self.bond_token_mint = bond_token_mint;
        self.access_token_mint = access_token_mint;

        self.bond_amount = 0; // TODO: update when take bonds

        // if a_to_b, means bond token is token a
        self.total_bond_amount = bond_amount;
        self.total_access_amount = access_amount;
        Ok(())
    }
}
