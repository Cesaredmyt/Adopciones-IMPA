"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Calendar, CheckCircle, Clock, Activity, Search, 
  MoreVertical, Save, X, Filter, Download, 
  ChevronLeft, ChevronRight, Eye, AlertCircle, Loader2
} from "lucide-react"; 

interface RegistroEsterilizacion {
  id: string;
  folio: string;
  nombre_responsable: string;
  telefono_responsable: string;
  nombre_mascota: string;
  peso: number;
  especie: string;
  sexo: string;
  edad: string | null;
  notas_clinicas: string | null;
  estado: string;
  created_at: string;
}

export default function EsterilizacionesPage() {
  const supabase = createClient();

  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'tabla' | 'formulario'>('dashboard'); 
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [registros, setRegistros] = useState<RegistroEsterilizacion[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroEsterilizacion | null>(null);

  const [formData, setFormData] = useState({
    nombre_responsable: "",
    telefono_responsable: "",
    nombre_mascota: "",
    peso: "",
    especie: "",
    sexo: "",
    edad: "",
    notas_clinicas: ""
  });

  const cargarEsterilizaciones = async () => {
    setCargandoDatos(true);
    try {
      const { data, error } = await supabase
        .from('esterilizaciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistros(data || []);
    } catch (error) {
      console.error("Error al obtener datos de Supabase:", error);
    } finally {
      setCargandoDatos(false);
    }
  };

  useEffect(() => {
    cargarEsterilizaciones();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const folioGenerado = `FOL-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase
        .from('esterilizaciones')
        .insert([
          {
            folio: folioGenerado,
            nombre_responsable: formData.nombre_responsable,
            telefono_responsable: formData.telefono_responsable,
            nombre_mascota: formData.nombre_mascota,
            peso: parseFloat(formData.peso),
            especie: formData.especie,
            sexo: formData.sexo,
            edad: formData.edad || null,
            notas_clinicas: formData.notas_clinicas || null,
            estado: 'En Espera'
          }
        ]);

      if (error) throw error;
      
      alert(`¡Expediente guardado con éxito! Folio: ${folioGenerado}`);
      
      setFormData({
        nombre_responsable: "", telefono_responsable: "", nombre_mascota: "",
        peso: "", especie: "", sexo: "", edad: "", notas_clinicas: ""
      });
      
      await cargarEsterilizaciones();
      setVistaActiva('dashboard');

    } catch (error) {
      console.error("Error al guardar en Supabase:", error);
      alert("Hubo un error al guardar los datos.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEstadoChange = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('esterilizaciones')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;
      setRegistros(prev => prev.map(reg => 
        reg.id === id ? { ...reg, estado: nuevoEstado } : reg
      ));

    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Hubo un error al cambiar el estado del paciente.");
    }
  };

  const historialFiltrado = registros.filter((registro) => {
    const textoBuscado = busqueda.toLowerCase();
    return (
      (registro.folio?.toLowerCase() || "").includes(textoBuscado) ||
      (registro.nombre_mascota?.toLowerCase() || "").includes(textoBuscado) ||
      (registro.nombre_responsable?.toLowerCase() || "").includes(textoBuscado)
    );
  });

  const totalHoy = registros.filter(r => {
    const hoy = new Date().toISOString().split('T')[0];
    const registroFecha = new Date(r.created_at).toISOString().split('T')[0];
    return hoy === registroFecha;
  }).length;

  const totalPendientes = registros.filter(r => r.estado === 'En Espera' || r.estado === 'En Quirófano').length;
  const totalCompletadasMes = registros.filter(r => r.estado === 'Completado').length;

  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50/50">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Módulo de Esterilizaciones</h1>
          <p className="text-slate-500 mt-1 font-medium">Gestión clínica y control de campañas del IMPA.</p>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-slate-200 mb-8 overflow-x-auto">
        <button onClick={() => setVistaActiva('dashboard')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'dashboard' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Panel de Control</button>
        <button onClick={() => setVistaActiva('tabla')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'tabla' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Registro Histórico</button>
        <button onClick={() => setVistaActiva('formulario')} className={`pb-3 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${vistaActiva === 'formulario' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Nueva Cirugía</button>
      </div>

      {vistaActiva === 'dashboard' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Pacientes Recientes</h3>
            </div>
            <div className="overflow-x-auto">
              {cargandoDatos ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
                  <p className="text-sm font-medium">Sincronizando con Supabase...</p>
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
                  <p className="text-sm font-medium">No hay pacientes registrados en el sistema.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'tabla' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por folio, nombre o dueño..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"/>
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
                             onChange={(e) => handleEstadoChange(registro.id, e.target.value)}
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
                              onClick={() => setRegistroSeleccionado(registro)}
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
        </div>
      )}

      {/* VISTA C: FORMULARIO CLÍNICO */}
      {vistaActiva === 'formulario' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Registrar Nueva Cirugía</h3>
              <p className="text-sm text-slate-500 mt-1">Completa el expediente clínico del paciente para ingresarlo al sistema.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">1</span> Datos del Responsable
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nombre Completo</span>
                    <input type="text" name="nombre_responsable" value={formData.nombre_responsable} onChange={handleInputChange} required placeholder="Ej. Juan Pérez" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Teléfono de Contacto</span>
                    <input type="tel" name="telefono_responsable" value={formData.telefono_responsable} onChange={handleInputChange} required placeholder="Ej. 443 123 4567" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </label>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">2</span> Datos del Paciente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <label className="block md:col-span-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nombre de la Mascota</span>
                    <input type="text" name="nombre_mascota" value={formData.nombre_mascota} onChange={handleInputChange} required placeholder="Ej. Firulais" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Peso (kg)</span>
                    <input type="number" step="0.1" name="peso" value={formData.peso} onChange={handleInputChange} required placeholder="Ej. 12.5" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Especie</span>
                    <select name="especie" value={formData.especie} onChange={handleInputChange} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700">
                      <option value="">Seleccionar...</option>
                      <option value="Canino">Canino</option>
                      <option value="Felino">Felino</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Sexo</span>
                    <select name="sexo" value={formData.sexo} onChange={handleInputChange} required className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700">
                      <option value="">Seleccionar...</option>
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Edad Aprox.</span>
                    <input type="text" name="edad" value={formData.edad} onChange={handleInputChange} placeholder="Ej. 2 años" className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                  </label>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">3</span> Observaciones Médicas
                </h4>
                <div className="grid grid-cols-1 gap-5">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Notas Clínicas Adicionales</span>
                    <textarea name="notas_clinicas" value={formData.notas_clinicas} onChange={handleInputChange} rows={4} placeholder="Alergias, complicaciones durante la cirugía..." className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-y"></textarea>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button type="button" disabled={guardando} onClick={() => setVistaActiva('dashboard')} className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center disabled:opacity-50">
                  <X className="w-4 h-4 mr-2" /> Cancelar
                </button>
                <button type="submit" disabled={guardando} className="px-6 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all flex items-center disabled:opacity-50 min-w-[180px] justify-center">
                  {guardando ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : <><Save className="w-4 h-4 mr-2" />Guardar Expediente</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLES DEL EXPEDIENTE */}
      {registroSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Expediente Clínico</h3>
              <button onClick={() => setRegistroSeleccionado(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-md hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Folio Asignado</p>
                  <p className="text-3xl font-black text-slate-900">{registroSeleccionado.folio}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getEstadoBadge(registroSeleccionado.estado)}`}>
                  {registroSeleccionado.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
                    <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">1</span> Datos del Responsable
                  </h4>
                  <p className="text-base font-bold text-slate-800">{registroSeleccionado.nombre_responsable}</p>
                  <p className="text-sm text-slate-600 mt-1">📞 {registroSeleccionado.telefono_responsable}</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
                    <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">2</span> Datos del Paciente
                  </h4>
                  <p className="text-base font-bold text-slate-800">
                    {registroSeleccionado.nombre_mascota} <span className="font-normal text-slate-500">({registroSeleccionado.especie})</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Peso: {registroSeleccionado.peso} kg • Sexo: {registroSeleccionado.sexo} • Edad: {registroSeleccionado.edad || 'No especificada'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center">
                  <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">3</span> Observaciones Médicas
                </h4>
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                  {registroSeleccionado.notas_clinicas || <span className="text-amber-600/60 italic font-medium">Sin observaciones clínicas registradas.</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-4 text-right font-medium">
                  Registrado el: {formatearFecha(registroSeleccionado.created_at)}
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
              <button onClick={() => setRegistroSeleccionado(null)} className="px-8 py-2.5 rounded-full text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-md transition-all hover:-translate-y-0.5">
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}