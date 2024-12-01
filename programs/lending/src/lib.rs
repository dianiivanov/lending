use anchor_lang::prelude::*;

declare_id!("CvonfvtTNUUTxhaS48XiS8BUoxjgz9DHXLha95G7EfPM");

#[program]
pub mod lending {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
