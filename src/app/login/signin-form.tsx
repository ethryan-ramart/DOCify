'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IconBrandGithub } from "@tabler/icons-react"
import { AlertDestructive } from "@/components/ui/AlertDestructive"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be an email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
})

import useSupabaseClient from '@/utils/supabase/client';
import { useEffect, useState } from "react"
import { loginWithEmail } from "./actions"
import { useFormState, useFormStatus } from "react-dom"

export default function SigninForm() {
  const supabase = useSupabaseClient();
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(loginWithEmail, initialState);
  const [ghLoading, setGHLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Reset the loading state if there are errors or a message
    if (state.errors || state.message || state.try) {
      setEmailLoading(false);
    }
  }, [state.errors, state.message, state.try]);

  // console.log(state);

  const loginWithGitHub = () => {
    setGHLoading(true);
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // redirectTo: `${process.env.NEXT_BASE_URL}/auth/callback`,
        // redirectTo: 'http://localhost:3000/auth/callback',
        redirectTo: 'https://dockyhub.vercel.app/auth/callback',
      },
    });
  };

  // Define form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit(async () => {
    setEmailLoading(true);
    dispatch({ ...form.getValues() });
  });

  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Are you new?
            <Button className="m-0 px-2 py-0" variant="link" asChild>
              <Link href="/signup">Create an account</Link>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={dispatch} onSubmit={handleSubmit} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" aria-describedby="email-error" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.email &&
                        state.errors.email.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          aria-describedby="password-error"
                          {...field}
                        />
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                    <div id="password-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.password &&
                        state.errors.password.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={emailLoading || ghLoading}>
                {
                  emailLoading ?
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                    : ("Sign In")
                }
              </Button>
            </form>
          </Form>
          <Button variant="link" asChild>
            <Link href="/password-recovery">Forgot password?</Link>
          </Button>
          {state.message && (
            <div id="message" aria-live="polite" aria-atomic="true">
              <AlertDestructive message={state.message} className="mt-2" variant="destructive" />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4 mb-2">Or sign in using:</p>
          <div className="flex w-full justify-center gap-1.5">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={loginWithGitHub}
              disabled={ghLoading || emailLoading}
            >
              {ghLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <IconBrandGithub />
              Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
