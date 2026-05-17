"use client";

import React, { useState } from "react";
import { 
  Calendar, CheckCircle, Clock, Activity, Search, 
  MoreVertical, Save, X, Filter, Download, 
  ChevronLeft, ChevronRight, Eye, AlertCircle
} from "lucide-react"; 

// 📊 MOCK DATA 1: Tarjetas de métricas
const kpiData = [
  { titulo: "Cirugías de Hoy", valor: "8", icono: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
  { titulo: "Citas Pendientes", valor: "12", icono: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { titulo: "Completadas (Mes)", valor: "145", icono: CheckCircle, color: "text-blue-600", bg: "bg-blue-100" },
  { titulo: "Próximas Campañas", valor: "2", icono: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
];

// 🐕 MOCK DATA 2: Lista rápida del Dashboard
const pacientesHoy = [
  { id: 'FOL-001', dueno: 'María López', mascota: 'Max', especie: 'Canino', peso: '12 kg', hora: '08:00 AM', estado: 'Completado' },
  { id: 'FOL-002', dueno: 'Carlos Ruiz', mascota: 'Luna', especie: 'Felino', peso: '4.5 kg', hora: '09:30 AM', estado: 'En Quirófano' },
  { id: 'FOL-003', dueno: 'Ana Gómez', mascota: 'Rocky', especie: 'Canino', peso: '22 kg', hora: '11:00 AM', estado: 'En Espera' },
];

// 📚 MOCK DATA 3: Historial Completo
const historialCirugias = [
  { id: 'FOL-001', fecha: '17 May 2026', dueno: 'María López', mascota: 'Max', especie: 'Canino', cirujano: 'Dr. Hernández', estado: 'Completado' },
  { id: 'FOL-899', fecha: '15 May 2026', dueno: 'Luis Torres', mascota: 'Zeus', especie: 'Canino', cirujano: 'Dra. Silva', estado: 'Completado' },
  { id: 'FOL-898', fecha: '15 May 2026', dueno: 'Carmen Vega', mascota: 'Pelusa', especie: 'Felino', cirujano: 'Dr. Hernández', estado: 'Complicación' },
  { id: 'FOL-897', fecha: '14 May 2026', dueno: 'Roberto Díaz', mascota: 'Boby', especie: 'Canino', cirujano: 'Dra. Silva', estado: 'Cancelado' },
  { id: 'FOL-896', fecha: '14 May 2026', dueno: 'Sofía Castro', mascota: 'Mía', especie: 'Felino', cirujano: 'Dr. Hernández', estado: 'Completado' },
];

export default function EsterilizacionesPage() {
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'tabla' | 'formulario'>('tabla'); 
  
  // 🔥 NUEVO ESTADO: Guarda el texto que el usuario escribe en el buscador
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

  // 🔥 LÓGICA DE FILTRADO: Compara la búsqueda con el Folio, la Mascota y el Dueño
  const historialFiltrado = historialCirugias.filter((registro) => {
    const textoBuscado = busqueda.toLowerCase();
    return (
      registro.id.toLowerCase().includes(textoBuscado) ||
      registro.mascota.toLowerCase().includes(textoBuscado) ||
      registro.dueno.toLowerCase().includes(textoBuscado)
    );
  });

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50/50">
      
      {/* 1. Encabezado */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Módulo de Esterilizaciones
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gestión clínica y control de campañas del IMPA.
          </p>
        </div>
      </div>

      {/* 2. Tabs de Navegación */}
      <div className="flex space-x-6 border-b border-slate-200 mb-8 overflow-x-auto">
        <button onClick={() => setVistaActiva('dashboard')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'dashboard' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          Panel de Control
        </button>
        <button onClick={() => setVistaActiva('tabla')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'tabla' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          Registro Histórico
        </button>
        <button onClick={() => setVistaActiva('formulario')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'formulario' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          Nueva Cirugía
        </button>
      </div>

      {/* 3. VISTAS DINÁMICAS */}
      
      {/* VISTA A: PANEL DE CONTROL */}
      {vistaActiva === 'dashboard' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icono;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4 hover:shadow-md transition-all">
                  <div className={`p-3 rounded-xl ${kpi.bg}`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.titulo}</p>
                    <p className="text-2xl font-black text-slate-900">{kpi.valor}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Agenda del Día</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Folio</th>
                    <th className="p-4 font-semibold">Mascota / Especie</th>
                    <th className="p-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  {pacientesHoy.map((paciente, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium">{paciente.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{paciente.mascota}</p>
                        <p className="text-xs text-slate-500">{paciente.especie}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getEstadoBadge(paciente.estado)}`}>
                          {paciente.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA B: TABLA HISTÓRICA */}
      {vistaActiva === 'tabla' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Barra de Herramientas Superior */}
            <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              
              {/* Buscador Conectado al Estado */}
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

              {/* Botones de Filtro y Exportación */}
              <div className="flex space-x-3 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center">
                  <Filter className="w-4 h-4 mr-2 text-slate-400" />
                  Filtros
                </button>
                <button className="flex-1 lg:flex-none px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-md hover:bg-emerald-100 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Tabla Principal */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Folio</th>
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4 font-semibold">Paciente</th>
                    <th className="p-4 font-semibold">Responsable</th>
                    <th className="p-4 font-semibold">Cirujano</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  
                  {/* 🔥 CONDICIÓN: Si hay resultados, mapeamos el arreglo filtrado. Si no, mostramos aviso. */}
                  {historialFiltrado.length > 0 ? (
                    historialFiltrado.map((registro, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 font-bold text-slate-900">{registro.id}</td>
                        <td className="p-4 text-slate-500">{registro.fecha}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800">{registro.mascota}</span>
                          <span className="text-xs text-slate-400 ml-2">({registro.especie})</span>
                        </td>
                        <td className="p-4 text-slate-600">{registro.dueno}</td>
                        <td className="p-4 text-slate-500">{registro.cirujano}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${getEstadoBadge(registro.estado)}`}>
                            {registro.estado}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50" title="Ver Expediente">
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
                          <p className="text-sm mt-1">{`No hay coincidencias para "${busqueda}"`}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <span className="text-xs text-slate-500 font-medium">Mostrando {historialFiltrado.length} registros</span>
              <div className="flex space-x-1">
                <button className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-sm">1</button>
                <button className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled={historialFiltrado.length === 0}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VISTA C: FORMULARIO CLÍNICO */}
      {vistaActiva === 'formulario' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
          {/* ... (Todo el formulario se mantiene exactamente igual que en el paso anterior) ... */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Registrar Nueva Cirugía</h3>
              <p className="text-sm text-slate-500 mt-1">Completa el expediente clínico del paciente para ingresarlo al sistema.</p>
            </div>
            <form className="p-6 md:p-8 space-y-8">
              
              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                  Datos del Responsable
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nombre Completo</span>
                    <input type="text" placeholder="Ej. Juan Pérez" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Teléfono de Contacto</span>
                    <input type="tel" placeholder="Ej. 443 123 4567" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </label>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                  Datos del Paciente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <label className="block md:col-span-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nombre de la Mascota</span>
                    <input type="text" placeholder="Ej. Firulais" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Peso (kg)</span>
                    <input type="number" step="0.1" placeholder="Ej. 12.5" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Especie</span>
                    <select className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700">
                      <option value="">Seleccionar...</option>
                      <option value="canino">Canino</option>
                      <option value="felino">Felino</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Sexo</span>
                    <select className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700">
                      <option value="">Seleccionar...</option>
                      <option value="macho">Macho</option>
                      <option value="hembra">Hembra</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Edad Aprox.</span>
                    <input type="text" placeholder="Ej. 2 años" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </label>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                  Observaciones Médicas
                </h4>
                <div className="grid grid-cols-1 gap-5">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Notas Clínicas Adicionales</span>
                    <textarea rows={4} placeholder="Alergias, complicaciones durante la cirugía..." className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y"></textarea>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button type="button" onClick={() => setVistaActiva('dashboard')} className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center">
                  <X className="w-4 h-4 mr-2" /> Cancelar
                </button>
                <button type="submit" onClick={(e) => e.preventDefault()} className="px-6 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all flex items-center">
                  <Save className="w-4 h-4 mr-2" /> Guardar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}