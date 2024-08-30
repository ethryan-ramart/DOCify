// 'use client'

import UpdatePasswordForm from './update-password-form'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { useEffect, useState } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Password'
}

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user);

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <UpdatePasswordForm />
    </div>
  )
}