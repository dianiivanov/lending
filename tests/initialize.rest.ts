import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";
import { Lending } from "../target/types/lending";
import BN from "bn.js";


describe("lending", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
  
    const program = anchor.workspace.Lending as Program<Lending>;
  
    const bob = anchor.web3.Keypair.generate();
    const alice = anchor.web3.Keypair.generate();
  
    const topic_bob1 = "Hello There";
    const content_bob1 = "This is my first tweet on this app, I like it here!"
  
    const topic_bob2 = "This Topic is too long bla bla bla bla bla bla bla bla bla bla bla bla";
    const content_bob2 = "This topic is too long , but I wanna try it !!"
  
    const topic_bob3 = "We have content too long";
    const content = "ten bytes!"
    let content_500_bytes = content.repeat(50);
    const content_bob3 = content_500_bytes + "+1"
  
    const topic_bob4 = "I don`t like Alice";
    const content_bob4 = "I bet Alice will dislikes this!";
  
    const comment_tmp = "I don`t like you Bob!"
    const comment_alice1 = comment_tmp.repeat(24);
  
    const comment_alice2 = "I dont`t like you Bob. It is enough if I say it once";
    
    async function airdrop(connection: any, address: any, amount = 1000000000) {
        await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
    }

    describe("initialize", () => {
        // Configure the client to use the local cluster.
        // const provider = anchor.AnchorProvider.local();
        // anchor.setProvider(provider);
        // async function createMint(provider: anchor.AnchorProvider, authority: PublicKey): Promise<PublicKey> {
        //     const mint = anchor.web3.Keypair.generate(); // Generate a new keypair for the mint
        //     const lamports = await provider.connection.getMinimumBalanceForRentExemption(MintLayout.span); // Get rent-exempt balance for a mint
        
        //     const tx = new anchor.web3.Transaction().add(
        //         // Create the mint account
        //         anchor.web3.SystemProgram.createAccount({
        //             fromPubkey: provider.wallet.publicKey,
        //             newAccountPubkey: mint.publicKey,
        //             lamports, // Rent-exempt balance
        //             space: MintLayout.span, // Space required for a mint account
        //             programId: TOKEN_PROGRAM_ID, // SPL Token Program
        //         }),
        //         // Initialize the mint account
        //         anchor.web3.Token.createInitMintInstruction(
        //             TOKEN_PROGRAM_ID,
        //             mint.publicKey,
        //             9, // Decimals
        //             authority, // Mint authority
        //             null // Freeze authority (set to null for no freeze authority)
        //         )
        //     );
        
        //     // Send the transaction and confirm
        //     await provider.sendAndConfirm(tx, [mint]);
        
        //     // Return the public key of the mint
        //     return mint.publicKey;
        // }
        

        function getGlobalStateAddress(admin: PublicKey, programID: PublicKey) {
            return PublicKey.findProgramAddressSync(
            [
                anchor.utils.bytes.utf8.encode("global-state"),
                admin.toBuffer()
            ], programID);
        }

        it("Initializes the program", async () => {
            // Generate a new keypair for the global state account.
            await airdrop(provider.connection, bob.publicKey);

            // Hardcode the mints for testing.
            const collateralMint = anchor.web3.Keypair.generate().publicKey;
            const borrowMint = anchor.web3.Keypair.generate().publicKey;

            // Collateral ratio to set.
            const collateralRatio = new BN(150); // Example: 150% collateral ratio.
            const balance = await provider.connection.getBalance(bob.publicKey);
            console.log("Bob's balance:", balance);
            // Call the initialize function.
            const [global_state_pkey, global_state_bump] = getGlobalStateAddress(bob.publicKey, program.programId);
            console.log("Global State:", global_state_pkey.toBase58());
            console.log("Collateral Vault:", collateralMint.toBase58());
            console.log("Borrow Reserve:", borrowMint.toBase58());
            console.log("Admin (Bob):", bob.publicKey.toBase58());
            
            await program.methods
            .initialize(collateralRatio)
            .accounts({
                admin: bob.publicKey,
                globalState: global_state_pkey,
                collateralMint: collateralMint,
                borrowMint: borrowMint,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([bob]).rpc({ commitment: "confirmed" });

            // console.log("===========================================");
            // const account = await program.account.globalState.fetch(global_state_pkey);

            // // Assertions to verify the fields.
            // assert.equal(account.collateralRatio.toString(), "150");
            // assert.equal(account.collateralMint.toBase58(), collateralMint.toBase58());
            // assert.equal(account.borrowMint.toBase58(), borrowMint.toBase58());
            // assert.equal(account.admin.toBase58(), bob.publicKey.toBase58());
        });
    });
});
