import SigninForm from './signin-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login'
}

export default function LoginPage() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SigninForm />
    </div>
  )
}