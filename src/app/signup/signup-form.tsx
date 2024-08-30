'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
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
import { redirect } from "next/navigation"

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const commonPasswords = ['password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon', 'pussy', 'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123', 'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111', '2000', 'jordan', 'superman', 'harley', '123456', '12345678'];

const signupSchema = z.object({
  email: z.string().max(50).email(),
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
  .refine(data => !data.password.includes(data.email), {
    message: 'Password should not contain your email.',
    path: ['confirmPassword']
  });

import useSupabaseClient from '@/utils/supabase/client';
import { useEffect, useState } from "react"
import { signupWithEmail } from "./actions"
import { useFormState } from "react-dom"

export default function SignupForm() {
  const supabase = useSupabaseClient();
  const initialState = { message: "", errors: {} }; // I needed to remove the success key from the initial state, IDKN why
  const [state, dispatch] = useFormState(signupWithEmail, initialState);
  const [ghLoading, setGHLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Reset the loading state if there are errors or a message
    if (state.errors || state.message || state.success) {
      setEmailLoading(false);
    }
    if (state.success !== "") {
      setTimeout(() => {
        redirect('/login');
      }, 2000)
    }
  }, [state.errors, state.message, state.success]);

  // console.log(state);

  const loginWithGitHub = () => {
    setGHLoading(true);
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // Define form with react-hook-form
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle form submission
  const handleSubmit = form.handleSubmit(async () => {
    setEmailLoading(true);
    dispatch({ ...form.getValues() });
  });

  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Already have an account?
            <Button className="m-0 px-2 py-0" variant="link">
              <Link href="/login">
                Sign In
              </Link>
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
                      <Input
                        placeholder="Your email"
                        aria-describedby="email-error"
                        disabled={emailLoading || ghLoading || !!state?.success}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                          disabled={emailLoading || ghLoading || !!state?.success}
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
                    <FormMessage />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          aria-describedby="confirmPassword-error"
                          disabled={emailLoading || ghLoading || !!state?.success}
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
                    <FormMessage />
                    <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.confirmPassword &&
                        state.errors.confirmPassword.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>

                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={emailLoading || ghLoading || !!state?.success}>
                {
                  emailLoading ?
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                    : ("Sign Up")
                }
              </Button>
            </form>
          </Form>
          {state.message && (
            <div id="message" aria-live="polite" aria-atomic="true">
              <AlertDestructive message={state.message} className="mt-2" variant="destructive" />
            </div>
          )}
          {state.success && (
            <AlertDestructive message={state.success} className={"mt-2"} variant={'success'} />
          )}
          <p className="text-sm text-gray-500 mt-4 mb-2">Or sign up using:</p>
          <div className="flex w-full justify-center gap-1.5">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={loginWithGitHub}
              disabled={emailLoading || ghLoading || !!state?.success}
            >
              {ghLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <IconBrandGithub />
              Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
