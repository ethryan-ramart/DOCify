'use server'

import { unstable_noStore as noStore  } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import {z} from 'zod'

const pwdRecoverySchema = z.object({
  email: z.string().max(50).email({ message: 'Invalid email.' })
})

export type State = {
  errors?: { 
    email?: string[];
  };
  message?: string | undefined;
  success?: string | undefined;
};

export async function pwdRecoveryRequest(prevState: State, data: any) {
  noStore();

  const validatedFields = pwdRecoverySchema.safeParse({ email: data.email });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields.'
    };
  }

  const supabase = createClient();

  
  const { data: rpwdData, error } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
    // redirectTo: `${process.env.NEXT_BASE_URL}/auth/callback?next=/password-update`,
    // redirectTo: `http://localhost:3000/auth/callback?next=/password-update`,
    redirectTo: `https://docify.xyz/auth/callback?next=/password-update`,
  })

  if (error) {
    return {
      message: `There was an error, try again. ${error.message}`
    }
  };

  return {
    success: 'An email with instructions has been sent, check your inbox and your spam folder.'
  };
}
