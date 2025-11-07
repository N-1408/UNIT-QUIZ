import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuth";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const PageContainer = ({ className, children }: PageContainerProps) => {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-ui-background px-6 text-sm text-text-secondary">
        Yuklanmoqda...
      </div>
    );
  }

  return (
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
};
