use std::num::TryFromIntError;

use anchor_lang::error;

// code of custom errors start at 0x1770
#[error]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Number Cast Error")]
    NumberCastError, //  0x1770

    #[msg("Sig Failed")]
    SigFailed, //  0x1771

    //internal error
    #[msg("Internal Error")]
    InternalError, //  0x1772

    //token mismatched
    #[msg("Token Mismatched")]
    TokenMismatched, //  0x1773

    //token claim exceed
    #[msg("Token Claim Exceed")]
    TokenClaimExceed, //  0x1774
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
