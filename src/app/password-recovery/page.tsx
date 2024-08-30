import PasswordRecoveryForm from './password-recovery-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Recovery'
}

export default function LoginPage() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <PasswordRecoveryForm />
    </div>
  )
}