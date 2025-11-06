import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type PageProps = PropsWithChildren<{
  className?: string;
}>;

export const Page = ({ className, children }: PageProps) => (
  <main
    className={cn(
      "safe-area relative mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-5 px-5 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-4 sm:px-6 lg:gap-8 lg:px-12 lg:pb-14",
      "md:rounded-[28px] md:border md:border-border md:bg-surface md:shadow-elev-md",
      className
    )}
  >
    {children}
  </main>
);
