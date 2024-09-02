import styles from '@/app/home.module.css'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton
} from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Button } from "@/components/ui/button"


export default async function Home() {
  const user = await currentUser()

  return (
    <main className=' h-screen'>
      <nav className='bg-gradient-to-br from-zinc-950 to-zinc-900 h-20 w-screen flex flex-row-reverse align-center'>
        <div className='flex flex-column align-center justify-center pr-10 pl-10'>
        <SignedIn>
          <UserButton/>
        </SignedIn>
        </div>
        {/* <div className='text-gray-200 flex flex-col align-center justify-center '>
          <span className='text-xl'>
          {user?.firstName}
          </span>
        </div> */}
        <div className='flex flex-col align-center justify-center pl-8'>
        <SignedIn>
              <Button className={`bg-gray-700 text-gray-400`} variant="ghost"> 
                <a href="/workflows">
                  Dasboard
                </a> 
                </Button>
        </SignedIn>
        </div>

      </nav>

      <div className={`font-sans ${styles.heroDiv} w-screen h-2/5 flex flex-row justify-center items-center`}>
        <div className={`${styles.heroCard} bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col h-2/3 w-2/4 justify-center align-center border border-zinc-950 border-2 shadow-lg rounded-md`}>
          <h1 className={`${styles.textWelcome} text-gray-200 text-center font-extrabold m-2`}>
            Welcome!
          </h1>
          <h3 className={`${styles.textSchedule} text-gray-400 text-center font-medium m-2`}>
            Schedule your solana transactions with us.
          </h3>
          <div className='flex flex-row align-center justify-center m-2'>

            <SignedIn>
              <Button className={`bg-gray-700 text-gray-400 w-2/5`} variant="ghost"> 
                <a href="/workflows">
                  Dasboard
                </a>
                 </Button>
            </SignedIn>

            <SignedOut>
              
                <Button className={`bg-gray-700 text-gray-400 w-2/5`} variant="ghost"> 
                   <SignInButton />
                </Button>

                <div>
                <p className={`${styles.textOr} text-gray-400 mr-4 ml-4`}>
                  OR
                </p>
                </div>

                <Button className={`bg-gray-700 text-gray-400 w-2/5`} variant="ghost"> 
                  <SignUpButton mode="modal">
                  </SignUpButton>
                </Button>
              
        
            </SignedOut>
          </div>
        </div>

      </div>

      <p className={`${styles.textSchedule} text-gray-200 text-center`}>Please Note :- In order for the cron job to work your website should be kept running till the scheduled time as aws lambda or dockers are not used</p>
      <p className={`${styles.textSchedule} text-gray-200 text-center`}> For now i have only used devnet connection as was not able to test on main net</p>
    </main>

  );
}
