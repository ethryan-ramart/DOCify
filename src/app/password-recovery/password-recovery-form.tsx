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
import { Loader2 } from "lucide-react"
import { AlertDestructive } from "@/components/ui/AlertDestructive"

import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email.",
  }).max(50, {
    message: "Email must be less than 50 characters."
  })
})

import { useEffect, useState } from "react"
import { pwdRecoveryRequest } from "./actions"
import { useFormState, useFormStatus } from "react-dom"

const PasswordRecoveryForm = () => {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(pwdRecoveryRequest, initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.errors || state.message || state.success) {
      setLoading(false);
    }
  }, [state.errors, state.message, state.success]);

  // Define form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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
        <CardTitle>Password Recovery</CardTitle>
        <CardDescription>
          Send a recovery link or
          <Button className="m-0 px-2 py-0" variant="link" asChild>
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
                    <Input placeholder="Your email" aria-describedby="email-error"{...field} />
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
            {!state?.success &&
              <Button type="submit" className="w-full" disabled={loading || !!state?.success}>
                {
                  loading ?
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                    : ("Reset password")
                }
              </Button>
            }
          </form>
        </Form>
        {state.success && (
          <AlertDestructive message={state.success} className={"mt-2"} variant={'success'} />
        )}
        {state.message && (
          <AlertDestructive message={state.message} className={"mt-2"} variant={'destructive'} />
        )}
      </CardContent>
    </Card>
  )
}

export default PasswordRecoveryForm