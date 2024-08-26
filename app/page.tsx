import styles from '@/app/home.module.css'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export default async function Home() {
  const user = await currentUser()

  return (
    <main>
      <div className='min-h-screen border-amber-900 flex flex-col'>
        <nav>

        </nav>
          <h1 className='text-gray-50 w-2/5 border border-amber-900'>
           Schedule your Solana transactions with us!
          <p>
            {user?.firstName}
          </p>
          <p>
            {user?.id}
          </p>

          </h1>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          
          
          
          
      </div>

    </main>

  );
}
