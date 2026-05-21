import { toast } from "sonner";

export function toastConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast.custom(
      (id) => (
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl border border-impa-line p-5 shadow-impa-lg w-[340px] text-center">
          <p className="text-impa-text text-sm font-medium leading-snug">
            {message}
          </p>

          <div className="flex justify-center gap-2 w-full">
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              className="flex-1 h-9 rounded-lg bg-white border border-impa-line text-impa-text text-sm font-semibold hover:bg-impa-50 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/15"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              className="flex-1 h-9 rounded-lg bg-impa-500 hover:bg-impa-600 text-white text-sm font-semibold transition shadow-impa-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-impa-500/20"
            >
              Confirmar
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      }
    );
  });
}
