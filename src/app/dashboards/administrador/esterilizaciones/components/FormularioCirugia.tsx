import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, X, Loader2 } from "lucide-react";

interface FormularioCirugiaProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FormularioCirugia({
  onSuccess,
  onCancel,
}: FormularioCirugiaProps) {
  const supabase = createClient();
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState({
    nombre_responsable: "",
    telefono_responsable: "",
    nombre_mascota: "",
    peso: "",
    especie: "",
    sexo: "",
    edad: "",
    notas_clinicas: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const folioGenerado = `FOL-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase.from("esterilizaciones").insert([
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
          estado: "En Espera",
        },
      ]);

      if (error) throw error;

      alert(`¡Expediente guardado con éxito! Folio: ${folioGenerado}`);

      setFormData({
        nombre_responsable: "",
        telefono_responsable: "",
        nombre_mascota: "",
        peso: "",
        especie: "",
        sexo: "",
        edad: "",
        notas_clinicas: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Error al guardar en Supabase:", error);
      alert("Hubo un error al guardar los datos.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
          Registrar Nueva Cirugía
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Completa el expediente clínico del paciente para ingresarlo al
          sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        <div>
          <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
              1
            </span>{" "}
            Datos del Responsable
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Nombre Completo
              </span>
              <input
                type="text"
                name="nombre_responsable"
                value={formData.nombre_responsable}
                onChange={handleInputChange}
                required
                pattern="^[a-zA-ZÀ-ÿ\s]{3,50}$"
                title="Ingresa un nombre válido sin números ni símbolos"
                placeholder="Ej. Juan Pérez"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Teléfono de Contacto
              </span>
              <input
                type="tel"
                name="telefono_responsable"
                value={formData.telefono_responsable}
                onChange={(e) => {
                  const valorLimpio = e.target.value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    telefono_responsable: valorLimpio,
                  }));
                }}
                required
                maxLength={10}
                pattern="[0-9]{10}"
                title="Ingresa un número a 10 dígitos (ej. 4431234567)"
                placeholder="Ej. 4431234567"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </label>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
              2
            </span>{" "}
            Datos del Paciente
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <label className="block md:col-span-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Nombre de la Mascota
              </span>
              <input
                type="text"
                name="nombre_mascota"
                value={formData.nombre_mascota}
                onChange={handleInputChange}
                required
                maxLength={30}
                pattern="^[a-zA-ZÀ-ÿ0-9\s]{2,30}$"
                title="Ingresa un nombre válido (letras y números permitidos, máx. 30 caracteres)"
                placeholder="Ej. Firulais"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Peso (kg)
              </span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                required
                placeholder="Ej. 12.5"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Especie
              </span>
              <select
                name="especie"
                value={formData.especie}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700"
              >
                <option value="">Seleccionar...</option>
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Sexo
              </span>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700"
              >
                <option value="">Seleccionar...</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Edad Aprox.
              </span>
              <input
                type="text"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                maxLength={15}
                pattern="^[a-zA-Z0-9\s]*$"
                title="Solo letras y números cortos (Ej. 2 años, 6 meses)"
                placeholder="Ej. 2 años"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </label>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center">
            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
              3
            </span>{" "}
            Observaciones Médicas
          </h4>
          <div className="grid grid-cols-1 gap-5">
            <label className="block">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Notas Clínicas Adicionales
              </span>
              <textarea
                name="notas_clinicas"
                value={formData.notas_clinicas}
                onChange={handleInputChange}
                rows={4}
                placeholder="Alergias, complicaciones durante la cirugía..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-y"
              ></textarea>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
          <button
            type="button"
            disabled={guardando}
            onClick={onCancel}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-2" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all flex items-center disabled:opacity-50 min-w-[180px] justify-center"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Expediente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
