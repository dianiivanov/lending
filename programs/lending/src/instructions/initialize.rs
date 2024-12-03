use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

pub fn initialize(
    ctx: Context<Initialize>,
    collateral_ratio: u64
) -> Result<()> {
    msg!("Signer (admin): {}", ctx.accounts.admin.key());
    let global_state = &mut ctx.accounts.global_state;

    // Set the global state parameters
    global_state.collateral_ratio = collateral_ratio;
    global_state.collateral_mint = ctx.accounts.collateral_mint.key();
    global_state.borrow_mint = ctx.accounts.borrow_mint.key();
    global_state.admin = ctx.accounts.admin.key();

    Ok(())
}

#[account]
pub struct GlobalState {
    pub collateral_ratio: u64,
    pub collateral_mint: Pubkey,
    pub borrow_mint: Pubkey,
    pub admin: Pubkey,
}

impl GlobalState {
    pub const LEN: usize = 8    // Discriminator
        + 8                     // collateral_ratio
        + 32                    // collateral_mint
        + 32                    // borrow_mint
        + 32;                   // admin
}

#[derive(Accounts)]
pub struct Initialize<'info> {    
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + GlobalState::LEN,
        seeds = [
            b"global-state",               // Static seed for global state
            admin.key().as_ref(),          // Admin key for uniqueness
        ],
        bump
    )] // Example size
    pub global_state: Account<'info, GlobalState>,
    #[account(
        init,
        payer = admin,
        token::mint = collateral_mint,
        token::authority = global_state,
    )]
    pub collateral_vault: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = admin,
        token::mint = borrow_mint,
        token::authority = global_state,
    )]
    pub borrow_reserve: Account<'info, TokenAccount>,
    pub collateral_mint: UncheckedAccount<'info>,
    pub borrow_mint: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}