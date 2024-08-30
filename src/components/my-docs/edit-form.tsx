"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { updateDocument } from "@/lib/data"
import { useFormStatus, useFormState } from 'react-dom'

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters."
  }),
  category: z.string().min(3, {
    message: "Category mus be at least 3 characters."
  }),
  cover: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The image cover must be less than 5MB.',
  }),
  file: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: 'The file must be less than 5MB.'
  })
})

type DocumentType = {
  id?: string,
  title: string,
  description: string,
  category: string,
  cover_url: string,
  file_url: string
}

export function EditForm({ document }: { document: DocumentType }) {
  const initialState = { message: "", errors: {} };
  const updateDocumentWithId = updateDocument.bind(null, document.id);
  const [state, dispatch] = useFormState(updateDocumentWithId, initialState);

  // console.log(state)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document.title,
      description: document.description,
      category: document.category,
      cover: undefined,
      file: undefined
    },
  })

  return (
    <Form {...form}>
      <form action={dispatch} className="space-y-8 w-full max-w-2xl">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Document title..." {...field} aria-describedby="title-error" />
              </FormControl>
              {/* <FormMessage /> */}
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.title &&
                  state.errors.title.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Document description..." {...field} aria-describedby="description-error" />
              </FormControl>
              {/* <FormMessage /> */}
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.description &&
                  state.errors.description.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Document category..." {...field} aria-describedby="category-error" />
              </FormControl>
              {/* <FormMessage /> */}
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.category &&
                  state.errors.category.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        {/* Cover */}
        <FormField
          control={form.control}
          name="cover"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Cover</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Picture"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                  aria-describedby="cover-error"
                />
              </FormControl>
              {/* <FormMessage /> */}
              <div id="cover-error" aria-live="polite" aria-atomic="true">
                {state.errors?.cover &&
                  state.errors.cover.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
              <div className="text-muted">
                {document.cover_url && (
                  <img
                    src={document.cover_url}
                    alt="Cover"
                    className="w-16 h-16 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </FormItem>
          )}
        />
        {/* File */}
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Picture"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                  aria-describedby="file-error"
                />
              </FormControl>

              {/* File url preview */}
              <div className="text-muted max-w-sm">
                {document.file_url && (
                  <a
                    href={document.file_url}
                    target="_blank"
                    className="text-blue-500 line-clamp-4 overflow-x-auto"
                  >
                    {document.file_url}
                  </a>
                )}
              </div>

              {/* <FormMessage /> */}
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.file &&
                  state.errors.file.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />

        <div id="message" aria-live="polite" aria-atomic="true">
          {
            state.message !== null &&
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          }
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link
              href="/my-docs"
            >
              Cancel
            </Link>
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type='submit' disabled={pending}>{pending ? "Saving..." : "Save Document"}</Button>
}
