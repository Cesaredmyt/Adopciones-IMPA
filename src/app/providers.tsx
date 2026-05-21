"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "!bg-white !border !border-impa-line !text-impa-text !rounded-xl !shadow-impa-md",
            title: "!text-impa-text !font-semibold",
            description: "!text-impa-muted",
            success: "!bg-impa-50 !border-impa-200 !text-impa-800",
            error: "!bg-red-50 !border-red-200 !text-red-800",
            actionButton:
              "!bg-impa-500 hover:!bg-impa-600 !text-white !rounded-lg",
            cancelButton:
              "!bg-impa-50 hover:!bg-impa-100 !text-impa-text !rounded-lg",
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
