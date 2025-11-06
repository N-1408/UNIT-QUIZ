import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type PageProps = PropsWithChildren<{
  className?: string;
}>;

export const Page = ({ className, children }: PageProps) => (
  <main
    className={cn(
      "safe-area relative mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-6 sm:px-6 lg:gap-8 lg:px-12 lg:pb-16",
      "md:rounded-[32px] md:border md:border-stroke/60 md:bg-surface md:shadow-elev-md",
      className
    )}
  >
    {children}
  </main>
);
