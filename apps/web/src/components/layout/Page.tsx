import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type PageProps = PropsWithChildren<{
  className?: string;
}>;

export const Page = ({ className, children }: PageProps) => (
  <main
    className={cn(
      "safe-area mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-12",
      className
    )}
  >
    {children}
  </main>
);
