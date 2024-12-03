use crate::instructions::*;
use anchor_lang::prelude::*;

declare_id!("CvonfvtTNUUTxhaS48XiS8BUoxjgz9DHXLha95G7EfPM");

pub mod instructions;

#[program]
pub mod lending {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, collateral_ratio: u64) -> Result<()> {
        instructions::initialize(ctx, collateral_ratio)
    }
}

