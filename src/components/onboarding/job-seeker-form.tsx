"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GeneralButton } from "@/components/general/general-button";
import { saveJobSeeker } from "@/app/(home)/onboarding/actions";

const formSchema = z.object({
  jobSeekerName: z.string().min(1, "JobSeeker name is required."),
});

export function JobSeekerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobSeekerName: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await saveJobSeeker(data.jobSeekerName);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="jobSeekerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>JobSeeker Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <GeneralButton type="submit" loading={form.formState.isSubmitting}>
          Submit
        </GeneralButton>
      </FieldGroup>
    </form>
  );
}
