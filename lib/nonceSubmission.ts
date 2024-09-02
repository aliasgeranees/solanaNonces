"use server"
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    NONCE_ACCOUNT_LENGTH,
    NonceAccount,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';

import base58 from 'bs58';

// import cron from 'node-cron';
import { string, z } from "zod";

const formSchema = z.object({
    publickey: z.string().min(2).max(100),
    privatekey: z.string().min(2).max(100),
    date: z.date({
      required_error: "A date is required."
    }),
    timeHours: z.coerce.number(),
    timeMinutes: z.coerce.number(),
    solana: z.coerce.number(),
    recieverPublickey: z.string()
  })

async function createNonceAccount(
    connection: Connection,
    payer: Keypair,
    nonceKeyPair: Keypair,
    authority: PublicKey
  ) {
  
    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: nonceKeyPair.publicKey,
        lamports: 0.0015 * LAMPORTS_PER_SOL,
        space: NONCE_ACCOUNT_LENGTH,
        programId: SystemProgram.programId,
      }),
  
      SystemProgram.nonceInitialize({
        noncePubkey: nonceKeyPair.publicKey,
        authorizedPubkey: authority,
      }),
    );
  
    const sig = await sendAndConfirmTransaction(connection, tx, [
      payer,
      nonceKeyPair,
    ]);
    console.log(
      "Creating Nonce TX:",
      `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
    );
  
    // 3. Fetch the nonce account.
    const accountInfo = await connection.getAccountInfo(nonceKeyPair.publicKey);
    // 4. Serialize the nonce account data and return it.
  
    console.log(accountInfo);
  
    return NonceAccount.fromAccountData(accountInfo!.data);
  }

  export async function nonceSubmission(data : z.infer<typeof formSchema>) {

    // const connection = new Connection("https://little-dry-bird.solana-devnet.quiknode.pro/223da8c75ca840ab115d07fe592e6fb43bca89ff");
    // const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/4vjQqgGXJPykttUdmPTzSCScpmHQjmbW");
    const connection = new Connection(clusterApiUrl("devnet") , 'confirmed');

    // console.log(connection);

    const payer = Keypair.fromSecretKey(Uint8Array.from(base58.decode(data.privatekey)));

    console.log(payer.publicKey.toBase58())

    // 1. Create a Durable Transaction.
    // const [nonceKeypair] = makeKeypairs(1);
  
    const nonceKeypair = Keypair.generate();
  
    console.log(nonceKeypair.publicKey)
  
    // console.log(base58.encode(Uint8Array.from(nonceKeypair.publicKey)));
  
    // const recipient = Keypair.fromSecretKey(Uint8Array.from(base58.decode('bdUzRYM9tfeubQDRaJHVXZ1ECcC4Y6EhxzLbwqbXRHmqk7kksxkEWHLkiCLHs1b4iCyZ8Ku7S2frX3cQGzMepV4')));
    const recipient = new PublicKey(data.recieverPublickey);
    // 1.1 Create the nonce account.
    const nonceAccount = await createNonceAccount(
      connection,
      payer,
      nonceKeypair,
      payer.publicKey,
    );
  
    // 1.2 Create a new Transaction.
    const durableTx = new Transaction();
    durableTx.feePayer = payer.publicKey;
  
    // 1.3 Set the recentBlockhash to be the nonce value.
    durableTx.recentBlockhash = nonceAccount.nonce;
  
    // 1.4 Add the `nonceAdvance` instruction as the first instruction in the transaction.
    durableTx.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: payer.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
    );
  
    // 1.5 Add the transfer instruction (you can add any instruction you want here).
    durableTx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: data.solana * LAMPORTS_PER_SOL,
      }),
    );
    
    console.log(`transaction is added`)
    // 1.6 Sign the transaction with the keyPairs that need to sign it, and make sure to add the nonce authority as a signer as well.
    // In this particular example the nonce auth is the payer, and the only signer needed for our transfer instruction is the payer as well, so the payer here as a sign is sufficient.
    durableTx.sign(payer);
  
    // 1.7 Serialize the transaction and encode it.
    const serializedTx = base58.encode(
      durableTx.serialize({ requireAllSignatures: false }),
    );
    // 1.8 At this point you have a durable transaction, you can store it in a database or a file or send it somewhere else, etc.
    // ----------------------------------------------------------------
    console.log(`transaction is serialized`)
    // 2. Submit the durable transaction.
    // 2.1 Decode the serialized transaction.
    const tx = base58.decode(serializedTx);
  
    // 2.2 Submit it using the `sendAndConfirmRawTransaction` function.
    // const sig = await sendAndConfirmRawTransaction(connection, tx as Buffer, {
    //   skipPreflight: true,
    // });
  
    const hours = data.timeHours;
    const mins = data.timeMinutes
    const day = data.date.getDate();
    const month = (data.date.getMonth()+1);

    const combinedDate = new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate()+1, hours , mins );
    const newCombinedDate = new Date(combinedDate)
    let currentTime = new Date(Date.now()+(5*3600+30*60)*1000);

    let remainingTime = combinedDate.getTime() - currentTime.getTime();

    console.log("current Date is " , currentTime )
    console.log("combined date is ", combinedDate)

    console.log(remainingTime);

    const intervalId = setInterval( async () => {
      const sig = await sendAndConfirmTransaction(connection, durableTx, [payer]);
      console.log(
            "Transaction Signature:",
            `https://explorer.solana.com/tx/${sig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`,
          );
      clearInterval(intervalId) ;
    }, remainingTime); 


    // async function scheduleTransactionWithCorn() {
    //   console.log(`transaction begins`)
    //   const sig = await sendAndConfirmTransaction(connection, durableTx, [payer]);
  
    //   console.log(
    //     "Transaction Signature:",
    //     `https://explorer.solana.com/tx/${sig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`,
    //   );

    //   task.stop();
    // }

    // console.log(`cron is scheduled ${mins} ${hours} ${day} ${month}`)
    // min hour day month 
    // const task = cron.schedule(`${mins} ${hours} ${day} ${month} *`, scheduleTransactionWithCorn);
  }


