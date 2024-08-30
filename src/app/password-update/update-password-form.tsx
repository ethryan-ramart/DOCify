'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { AlertDestructive } from "@/components/ui/AlertDestructive"

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const commonPasswords = ['password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon', 'pussy', 'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123', 'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111', '2000', 'jordan', 'superman', 'harley', '123456', '12345678'];

// TODO: validate password is not the same as the current password or the email
const updatePWDSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(25, { message: 'Password must be at most 25 characters long.' })
    .regex(passwordComplexityRegex, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' })
    .refine(password => !commonPasswords.includes(password), { message: 'This password is too common.' }),
  confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ['confirmPassword'] // point to 'confirmPassword' field if passwords do not match
  })

// import useSupabaseClient from '@/utils/supabase/client';
import { useEffect, useState } from "react"
import { updatePassword } from "./actions"
import { useFormState } from "react-dom"
import { redirect } from "next/navigation"

export default function UpdatePasswordForm() {
  // const supabase = useSupabaseClient();
  const initialState = { message: "", errors: {} }; // I needed to remove the success key from the initial state, IDKN why
  const [state, dispatch] = useFormState(updatePassword, initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Reset the loading state if there are errors or a message
    if (state.errors || state.message || state.success) {
      setLoading(false);
    }
    if (state.success !== "") {
      setTimeout(() => {
        redirect('/login');
      }, 2000)
    }
  }, [state.errors, state.message, state.success]);

  // Define form with react-hook-form
  const form = useForm<z.infer<typeof updatePWDSchema>>({
    resolver: zodResolver(updatePWDSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  })

  // Handle form submission
  const handleSubmit = form.handleSubmit(async () => {
    setLoading(true);
    dispatch({ ...form.getValues() });
  });

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Password Update</CardTitle>
        <CardDescription>Please update your password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={dispatch} onSubmit={handleSubmit} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        aria-describedby="password-error"
                        disabled={loading || !!state?.success}
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
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        aria-describedby="confirmPassword-error"
                        disabled={loading || !!state?.success}
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
            {!state?.success &&
              <Button type="submit" className="w-full" disabled={loading || !!state?.success}>
                {
                  loading ?
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                    : ("Update")
                }
              </Button>
            }
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
      </CardContent>
    </Card>
  );
};
