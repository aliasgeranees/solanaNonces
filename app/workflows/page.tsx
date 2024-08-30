"use client"
import { CardWithForm } from "../components/cardwithforms"
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    SignUpButton
} from '@clerk/nextjs'
import styles from "./workflows.module.css"



export default async function Page() {
    return (
        <main className="w-screen h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <nav className='bg-gradient-to-br from-zinc-950 to-zinc-900 h-20 w-screen flex flex-row-reverse align-center'>
                <div className='flex flex-column align-center justify-center pr-10 pl-10'>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
            <div className={`${styles.heroDiv} mt-4 flex flex-row justify-center align-center`}>
                <div className={`${styles.cardDiv} flex flex-col justify-center align-center`}>
                    <CardWithForm />
                </div>
            </div>

        </main>
    );
}