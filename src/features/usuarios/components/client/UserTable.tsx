"use client";

import { UserCircle } from "lucide-react";
import type { PerfilConDireccion } from "@/features/usuarios/types/usuarios";

export default function UserTable({
  usuarios,
  onSelect,
}: {
  usuarios: PerfilConDireccion[];
  onSelect: (u: PerfilConDireccion) => void;
}) {
  return (
    <div className="rounded-2xl border border-impa-line bg-white overflow-hidden shadow-impa-sm">
      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden md:grid grid-cols-5 bg-gradient-to-b from-impa-surface-2 to-impa-surface-2/40 border-b border-impa-line text-[11px] font-bold uppercase tracking-[0.06em] text-impa-muted px-5 py-3">
        <div>Nombre</div>
        <div>Correo</div>
        <div>Teléfono</div>
        <div>Ocupación</div>
        <div>Estado</div>
      </div>

      {/* ===== FILAS ===== */}
      <div className="divide-y divide-impa-line-faint">
        {usuarios.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelect(u)}
            className="group block w-full text-left bg-white hover:bg-impa-tinted/60 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-impa-tinted/60"
          >
            {/* ===== MOBILE CARD ===== */}
            <div className="md:hidden p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-impa-line bg-gradient-to-br from-impa-50 to-white grid place-items-center text-impa-600 shadow-impa-xs">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-impa-text leading-tight">
                    {u.nombres} {u.apellido_paterno} {u.apellido_materno ?? ""}
                  </p>
                  <p className="text-[11px] text-impa-muted">
                    ID {u.id.slice(0, 6)}
                  </p>
                </div>
              </div>

              <div className="text-xs text-impa-muted mt-1">Correo:</div>
              <div className="text-sm text-impa-text break-words">{u.email}</div>

              <div className="text-xs text-impa-muted mt-1">Teléfono:</div>
              <div className="text-sm text-impa-text">{u.telefono || "—"}</div>

              <div className="text-xs text-impa-muted mt-1">Ocupación:</div>
              <div className="text-sm text-impa-text capitalize">{u.ocupacion || "—"}</div>

              <div className="text-xs text-impa-muted mt-1">Estado:</div>
              <div className="flex justify-start">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    u.activo
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      u.activo ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* ===== DESKTOP ROW ===== */}
            <div className="hidden md:grid grid-cols-5 items-center px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full border border-impa-line bg-gradient-to-br from-impa-50 to-white grid place-items-center text-impa-600 shadow-impa-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-semibold text-impa-text text-sm group-hover:text-impa-700 transition-colors duration-150 truncate">
                    {u.nombres} {u.apellido_paterno} {u.apellido_materno ?? ""}
                  </div>
                  <div className="text-[10px] text-impa-muted mt-0.5">
                    ID {u.id.slice(0, 6)}
                  </div>
                </div>
              </div>

              <div className="text-impa-text text-sm truncate">{u.email}</div>

              <div className="text-impa-text text-sm">{u.telefono || "—"}</div>

              <div className="text-impa-text text-sm capitalize">{u.ocupacion}</div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    u.activo
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      u.activo ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="py-10 text-center text-impa-muted border-t border-impa-line-faint">
          No se encontraron usuarios.
        </div>
      )}
    </div>
  );
}
