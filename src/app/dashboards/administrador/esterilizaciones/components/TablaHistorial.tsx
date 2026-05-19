import React, { useState } from "react";
import { Search, AlertCircle, Loader2, Eye } from "lucide-react";
import { RegistroEsterilizacion } from "../page";

interface TablaHistorialProps {
  registros: RegistroEsterilizacion[];
  cargandoDatos: boolean;
  onEstadoChange: (id: string, nuevoEstado: string) => void;
  onVerExpediente: (registro: RegistroEsterilizacion) => void;
}

export default function TablaHistorial({ registros, cargandoDatos, onEstadoChange, onVerExpediente }: TablaHistorialProps) {
  const [busqueda, setBusqueda] = useState("");

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

  const historialFiltrado = registros.filter((registro) => {
    const textoBuscado = busqueda.toLowerCase();
    return (
      (registro.folio?.toLowerCase() || "").includes(textoBuscado) ||
      (registro.nombre_mascota?.toLowerCase() || "").includes(textoBuscado) ||
      (registro.nombre_responsable?.toLowerCase() || "").includes(textoBuscado)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            placeholder="Buscar por folio, nombre o dueño..." 
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {cargandoDatos ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
            <p className="text-sm font-medium">Cargando historial clínico...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Folio</th>
                <th className="p-4 font-semibold">Fecha de Registro</th>
                <th className="p-4 font-semibold">Paciente</th>
                <th className="p-4 font-semibold">Responsable</th>
                <th className="p-4 font-semibold">Teléfono</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {historialFiltrado.length > 0 ? (
                historialFiltrado.map((registro, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-bold text-slate-900">{registro.folio}</td>
                    <td className="p-4 text-slate-500">{formatearFecha(registro.created_at)}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{registro.nombre_mascota}</span> 
                      <span className="text-xs text-slate-400 ml-2">({registro.especie} • {registro.sexo})</span>
                    </td>
                    <td className="p-4 text-slate-600">{registro.nombre_responsable}</td>
                    <td className="p-4 text-slate-500">{registro.telefono_responsable}</td>
                    <td className="p-4">
                      <select 
                        value={registro.estado}
                        onChange={(e) => onEstadoChange(registro.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border appearance-none cursor-pointer outline-none text-center ${getEstadoBadge(registro.estado)}`}
                      >
                        <option value="En Espera">EN ESPERA</option>
                        <option value="En Quirófano">EN QUIRÓFANO</option>
                        <option value="Completado">COMPLETADO</option>
                        <option value="Complicación">COMPLICACIÓN</option>
                        <option value="Cancelado">CANCELADO</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onVerExpediente(registro)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50" 
                        title="Ver Expediente"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>                        
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <AlertCircle className="w-10 h-10 mb-3 text-slate-300" />
                      <p className="text-base font-semibold text-slate-600">No se encontraron resultados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}