import React from "react";
import { Activity, Clock, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { RegistroEsterilizacion } from "../page";

interface PanelDashboardProps {
  registros: RegistroEsterilizacion[];
  cargandoDatos: boolean;
}

export default function PanelDashboard({ registros, cargandoDatos }: PanelDashboardProps) {
  
  // 🔥 TODA LA LÓGICA DE CÁLCULO SE MUDÓ AQUÍ
  const totalHoy = registros.filter(r => {
    const hoy = new Date().toISOString().split('T')[0];
    const registroFecha = new Date(r.created_at).toISOString().split('T')[0];
    return hoy === registroFecha;
  }).length;

  const totalPendientes = registros.filter(r => r.estado === 'En Espera' || r.estado === 'En Quirófano').length;
  const totalCompletadasMes = registros.filter(r => r.estado === 'Completado').length;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Completado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'En Quirófano': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'En Espera': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPIs Dinámicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-100"><Activity className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Registrados Hoy</p>
            <p className="text-2xl font-black text-slate-900">{cargandoDatos ? "..." : totalHoy}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-100"><Clock className="w-6 h-6 text-amber-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">En Espera / Proceso</p>
            <p className="text-2xl font-black text-slate-900">{cargandoDatos ? "..." : totalPendientes}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-100"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Completadas</p>
            <p className="text-2xl font-black text-slate-900">{cargandoDatos ? "..." : totalCompletadasMes}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-100"><Calendar className="w-6 h-6 text-purple-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Próximas Campañas</p>
            <p className="text-2xl font-black text-slate-900">2</p>
          </div>
        </div>
      </div>

      {/* Tabla de Pacientes Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Pacientes Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          {cargandoDatos ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
              <p className="text-sm font-medium">Sincronizando con la nube...</p>
            </div>
          ) : registros.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Folio</th>
                  <th className="p-4 font-semibold">Mascota / Especie</th>
                  <th className="p-4 font-semibold">Responsable</th>
                  <th className="p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {registros.slice(0, 4).map((paciente, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{paciente.folio}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{paciente.nombre_mascota}</p>
                      <p className="text-xs text-slate-500">{paciente.especie} • {paciente.peso} kg</p>
                    </td>
                    <td className="p-4 text-slate-600">{paciente.nombre_responsable}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getEstadoBadge(paciente.estado)}`}>{paciente.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <p className="text-sm font-medium">No hay pacientes registrados hoy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}