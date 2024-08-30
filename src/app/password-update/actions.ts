'use server'

import { unstable_noStore as noStore  } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import {z} from 'zod'

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const commonPasswords = ['password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon', 'pussy', 'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123', 'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111', '2000', 'jordan', 'superman', 'harley', '123456', '12345678'];

// TODO: validate password is not the same as the current password or the email
const updatePWDSchema = z.object({
  password: z.string()
    .min(8)
    .max(25)
    .regex(passwordComplexityRegex, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' })
    .refine(password => !commonPasswords.includes(password), { message: 'This password is too common.' }),
  confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ['confirmPassword'] // point to 'confirmPassword' field if passwords do not match
  })

export type State = {
  errors?: { 
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | undefined;
  success?: string | undefined;
};

export async function updatePassword(prevState: State, data: any) {
  noStore();
  
  const validatedFields = updatePWDSchema.safeParse({
    password: data.password,
    confirmPassword: data.confirmPassword
  });

  // TODO: validate password is not the same as the current password or the email 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields.'
    };
  }

  const supabase = createClient();
 
  const { error } = await supabase.auth.updateUser({
    password: data.password,
  })

  if (error) {
    return {
      message: `There was an error updating your password, try again. ${error.message}`
    }
  };

  return {
    success: 'Your password has been updated. Redirecting to login page.'
  };
}
