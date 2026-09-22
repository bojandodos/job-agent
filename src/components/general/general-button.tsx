"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type GeneralButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
};

export function GeneralButton({
  loading = false,
  disabled,
  children,
  ...props
}: GeneralButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
