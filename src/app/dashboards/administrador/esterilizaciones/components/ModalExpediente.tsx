import React from "react";
import { X } from "lucide-react";
import { RegistroEsterilizacion } from "../page";

interface ModalExpedienteProps {
  registro: RegistroEsterilizacion;
  onClose: () => void;
}

export default function ModalExpediente({ registro, onClose }: ModalExpedienteProps) {
  
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Completado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'En Quirófano': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'En Espera': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Complicación': return 'bg-red-100 text-red-700 border-red-200';
      case 'Cancelado': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Expediente Clínico</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Folio Asignado</p>
              <p className="text-3xl font-black text-slate-900">{registro.folio}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getEstadoBadge(registro.estado)}`}>
              {registro.estado}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
                <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">1</span> Datos del Responsable
              </h4>
              <p className="text-base font-bold text-slate-800">{registro.nombre_responsable}</p>
              <p className="text-sm text-slate-600 mt-1">📞 {registro.telefono_responsable}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
                <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">2</span> Datos del Paciente
              </h4>
              <p className="text-base font-bold text-slate-800">
                {registro.nombre_mascota} <span className="font-normal text-slate-500">({registro.especie})</span>
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Peso: {registro.peso} kg • Sexo: {registro.sexo} • Edad: {registro.edad || 'No especificada'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
              <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">3</span> Observaciones Médicas
            </h4>
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap leading-relaxed">
              {registro.notas_clinicas || <span className="text-amber-600/60 italic font-medium">Sin observaciones clínicas registradas.</span>}
            </div>
            <p className="text-[11px] text-slate-400 mt-4 text-right font-medium">
              Registrado el: {formatearFecha(registro.created_at)}
            </p>
          </div>
        </div>
        
        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 rounded-full text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-md transition-all hover:-translate-y-0.5">
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
}