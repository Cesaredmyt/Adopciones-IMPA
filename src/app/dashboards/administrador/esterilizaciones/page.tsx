"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ModalExpediente from "./components/ModalExpediente";
import FormularioCirugia from "./components/FormularioCirugia";
import TablaHistorial from "./components/TablaHistorial";
import PanelDashboard from "./components/PanelDashboard";

export interface RegistroEsterilizacion {
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
  const [registros, setRegistros] = useState<RegistroEsterilizacion[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroEsterilizacion | null>(null);

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

      {/* VISTA A: DASHBOARD */}
      {vistaActiva === 'dashboard' && (
         <PanelDashboard 
            registros={registros} 
            cargandoDatos={cargandoDatos} 
        />
      )}

      {/* VISTA B: TABLA HISTÓRICA */}
      {vistaActiva === 'tabla' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TablaHistorial 
            registros={registros}
            cargandoDatos={cargandoDatos}
            onEstadoChange={handleEstadoChange}
            onVerExpediente={setRegistroSeleccionado}
          />
        </div>
      )}

      {/* VISTA C: FORMULARIO CLÍNICO */}
      {vistaActiva === 'formulario' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
          <FormularioCirugia 
            onCancel={() => setVistaActiva('dashboard')}
            onSuccess={() => {
              cargarEsterilizaciones();
              setVistaActiva('dashboard');
            }}
          />
        </div>
      )}

      {/* MODAL IMPORTADO */}
      {registroSeleccionado && (
        <ModalExpediente 
          registro={registroSeleccionado} 
          onClose={() => setRegistroSeleccionado(null)} 
        />
      )}

    </div>
  );
}