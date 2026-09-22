"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GeneralButton } from "@/components/general/general-button";
import { saveCompany } from "@/app/(home)/onboarding/actions";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
});

export function CompanyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { companyName: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await saveCompany(data.companyName);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="companyName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
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
