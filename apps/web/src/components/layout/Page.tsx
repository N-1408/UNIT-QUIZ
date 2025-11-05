import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type PageProps = PropsWithChildren<{
  className?: string;
}>;

export const Page = ({ className, children }: PageProps) => (
  <main
    className={cn(
      "safe-area mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-6 sm:px-6 lg:px-10 lg:pb-12",
      "md:rounded-3xl md:bg-surface/70 md:shadow-glass md:ring-1 md:ring-white/10 md:backdrop-blur-xl",
      className
    )}
  >
    {children}
  </main>
);
