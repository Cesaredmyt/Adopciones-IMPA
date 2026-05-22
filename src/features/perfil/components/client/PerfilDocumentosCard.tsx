import { Card } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import type { Documento } from "@/features/perfil/types/perfil";

export default function PerfilDocumentosCard({
  documentos,
}: {
  documentos: Documento[];
}) {
  return (
    <Card className="border-impa-line bg-white p-6 shadow-impa-sm">
      <h2 className="mb-4 text-xl font-semibold text-impa-text">
        Documentos aprobados
      </h2>

      {documentos.length === 0 ? (
        <p className="text-impa-muted">No hay documentos aprobados.</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {documentos.map((d) => (
            <div
              key={d.id}
              className="flex flex-col items-center rounded-2xl border border-impa-line bg-impa-tinted p-4 shadow-impa-xs"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-impa-50">
                <FileCheck className="h-6 w-6 text-impa-600" />
              </div>
              <p className="font-medium capitalize text-impa-text">{d.tipo}</p>
              <a
                href={d.url ?? "#"}
                target="_blank"
                className="mt-3 rounded-xl bg-impa-500 px-3 py-1.5 text-sm font-semibold text-white shadow-impa-xs transition hover:bg-impa-600"
              >
                Ver documento
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
