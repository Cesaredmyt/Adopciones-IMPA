import { Metadata } from 'next'
import RegistroForm from '@/components/auth/registro-form'

export const metadata: Metadata = {
  title: 'Registro de Adopciones | IMPA',
  description: 'Crea tu cuenta para adoptar una mascota',
}

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/fondo.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        /* backgroundAttachment: 'fixed' ayuda a que si el formulario es muy largo, el fondo no se corte al hacer scroll */
        backgroundAttachment: "fixed", 
      }}
    >
      {/* Capa de oscurecimiento (Overlay) */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      
      {/* Contenedor del formulario (z-10 para que flote sobre el overlay) */}
      <div className="w-full max-w-md relative z-10 my-8">
        <RegistroForm />
        
        <p className="mt-6 text-center text-xs font-medium text-white/80 drop-shadow-md">
          Transformando adopciones en historias de amor
        </p>
      </div>
    </div>
  )
}