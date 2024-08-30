'use server'

import { revalidatePath, unstable_noStore as noStore  } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import {z} from 'zod'

const loginSchema = z.object({
  email: z.string().max(50).email(),
  password: z.string().min(6).max(25)
})

export type State = {
  errors?: { 
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  try?: string | null;
};

export async function loginWithEmail(prevState: State, data: any) {
  noStore();

  // const validatedFields = loginSchema.safeParse(Object.fromEntries(data.entries()));
  const validatedFields = loginSchema.safeParse({
    email: data.email,
    password: data.password
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields.'
    }
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)
  // const random = crypto.randomUUID();
  //? Math.random() is less expensive than crypto.randomUUID()
  const random = Math.random();
  if (error) {
    return {
      message: `${error.message}`,
      try: String(random)
    }
  };

  revalidatePath('/my-docs');
  redirect('/my-docs');
}
