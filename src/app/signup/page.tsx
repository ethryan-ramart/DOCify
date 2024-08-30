import SignupForm from './signup-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up'
}

export default function LoginPage() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SignupForm />
    </div>
  )
}