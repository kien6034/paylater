use anchor_lang::prelude::*;

pub fn get_message_bytes(tx_id: String, user: Pubkey, token_mint: Pubkey, amount: u64) -> Vec<u8> {
    let mut message = Vec::new();
    message.append(&mut tx_id.into_bytes());
    message.append(&mut user.as_ref().to_vec());
    message.append(&mut token_mint.as_ref().to_vec());
    message.append(&mut to_bytes(amount));

    message
}

pub fn to_bytes(input: u64) -> Vec<u8> {
    let mut bytes = Vec::with_capacity(8);

    bytes.extend(input.to_be_bytes());

    bytes
}
