import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const PageContainer = ({ className, children }: PageContainerProps) => (
  <main
    className={cn(
      "relative mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6",
      "px-[clamp(16px,4vw,28px)] py-[clamp(12px,2vh,24px)]",
      "pb-[calc(env(safe-area-inset-bottom)+110px)]",
      className
    )}
  >
    {children}
  </main>
);
