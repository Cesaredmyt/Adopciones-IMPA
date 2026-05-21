"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  IdCard,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  registroAdoptanteSchema,
  registroAdoptantePaso1Schema,
  registroAdoptantePaso2Schema,
  registroAdoptantePaso3Schema,
  type RegistroAdoptanteData,
} from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import TerminosModal from "../terminos/TerminosModal";
import PoliticaPrivacidadModal from "../terminos/PoliticaPrivacidadModal";
import React, { forwardRef } from "react";

interface FormErrors {
  [key: string]: string[];
}

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

export default function RegistroForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showTerminosModal, setShowTerminosModal] = useState(false);
  const [showPrivacidadModal, setShowPrivacidadModal] = useState(false);

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistroAdoptanteData>>({
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para validaciones
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingCurp, setIsCheckingCurp] = useState(false);
  const [curpExists, setCurpExists] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // Estado para requisitos de contraseña en tiempo real
  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
    });
  const [showRequirements, setShowRequirements] = useState(false);

  const totalSteps = 3;
  //Otra funcion para fecha
  const formatFecha = (value: string = "") => {
    if (typeof value !== "string") return "";

    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  //Funcion para completar fecha de nacimiento
  const FechaInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onChange, placeholder }, ref) => {
      // Autoformatear: dd/mm/yyyy
      const formatInput = (val: string) => {
        const digits = val.replace(/\D/g, ""); // remover letras
        let formatted = digits;

        if (digits.length >= 3) {
          formatted = digits.slice(0, 2) + "/" + digits.slice(2);
        }
        if (digits.length >= 5) {
          formatted =
            digits.slice(0, 2) +
            "/" +
            digits.slice(2, 4) +
            "/" +
            digits.slice(4, 8);
        }

        return formatted;
      };

      const handleChange = (e: any) => {
        const newValue = formatInput(e.target.value);
        onChange(newValue);
      };

      return (
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border rounded-xl hover:border-impa-500 
        focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:outline-none transition-all"
        />
      );
    }
  );
  FechaInput.displayName = "FechaInput";

  //requisitos de contraseña en tiempo real
  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  };

  //  verificar si el email existe
  const checkEmailExists = async (email: string): Promise<boolean> => {
    // No verificar si está vacío o incompleto
    if (!email || !email.includes("@")) {
      setEmailExists(false);
      return false;
    }

    setIsCheckingEmail(true);
    setEmailExists(false);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const exists = response.ok && data.exists === true;

      // estado UI
      if (exists) {
        setEmailExists(true);
        setErrors((prev) => ({
          ...prev,
          email: ["Este correo electrónico ya está registrado"],
        }));
      } else {
        setEmailExists(false);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }

      return exists;
    } catch {
      setEmailExists(false);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Función para verificar si el CURP existe
  const checkCurpExists = async (curp: string) => {
    if (!curp || curp.length < 18) return;

    setIsCheckingCurp(true);
    setCurpExists(false);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curp, action: "check-curp" }),
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        setCurpExists(true);
        setErrors((prev) => ({
          ...prev,
          curp: ["Este CURP ya está registrado"],
        }));
      } else {
        setCurpExists(false);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.curp;
          return newErrors;
        });
      }
    } catch {
      // Silenciamos: ya hay UI para "verificar CURP" deshabilitado en error.
    } finally {
      setIsCheckingCurp(false);
    }
  };

  // Función para validar contraseña
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      return false;
    }

    const { minLength, hasUpperCase, hasLowerCase, hasNumber } =
      passwordRequirements;

    if (!minLength || !hasUpperCase || !hasLowerCase || !hasNumber) {
      setPasswordError("La contraseña debe cumplir todos los requisitos");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // Función para validar que las contraseñas coincidan
  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError("Debes confirmar tu contraseña");
      return false;
    }

    if (confirmPass !== formData.password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  // Manejador de cambios en inputs
  const handleInputChange = (
    field: keyof RegistroAdoptanteData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores del campo cuando se modifica
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }

    // Si es el campo email, resetear el estado de emailExists
    if (field === "email") {
      setEmailExists(false);
    }

    // Si es el campo curp, resetear el estado de curpExists
    if (field === "curp") {
      setCurpExists(false);
    }

    // Si es el campo password, verificar requisitos en tiempo real
    if (field === "password" && typeof value === "string") {
      checkPasswordRequirements(value);
      setShowRequirements(value.length > 0);
      setPasswordError("");

      // Si hay confirmPassword, revalidar que coincidan
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          setConfirmPasswordError("Las contraseñas no coinciden");
        } else {
          setConfirmPasswordError("");
        }
      }
    }

    // Si es el campo confirmPassword, limpiar el error y verificar que coincidan
    if (field === "confirmPassword") {
      setConfirmPasswordError("");
      // Verificar si coincide con password
      if (
        typeof value === "string" &&
        formData.password &&
        value !== formData.password
      ) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      }
    }
  };

  // Obtener datos del paso actual
  const getStepData = (step: number) => {
    switch (step) {
      case 1:
        return {
          nombres: formData.nombres,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno,
          email: formData.email,
          telefono: formData.telefono,
        };
      case 2:
        return {
          fecha_nacimiento: formData.fecha_nacimiento,
          curp: formData.curp,
          ocupacion: formData.ocupacion,
        };
      case 3:
        return {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms,
          acceptPrivacy: formData.acceptPrivacy,
        };
      default:
        return {};
    }
  };

  // Schema del paso actual
  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return registroAdoptantePaso1Schema;
      case 2:
        return registroAdoptantePaso2Schema;
      case 3:
        return registroAdoptantePaso3Schema;
      default:
        return registroAdoptanteSchema;
    }
  };

  // Validar paso actual
  const validateCurrentStep = () => {
    const stepData = getStepData(currentStep);
    const newErrors: FormErrors = {};

    // Validación del Paso 1
    if (currentStep === 1) {
      if (!formData.nombres || formData.nombres.trim() === "") {
        newErrors.nombres = ["Por favor ingresa tu nombre(es)"];
      }
      if (
        !formData.apellido_paterno ||
        formData.apellido_paterno.trim() === ""
      ) {
        newErrors.apellido_paterno = ["Por favor ingresa tu apellido paterno"];
      }
      if (
        !formData.apellido_materno ||
        formData.apellido_materno.trim() === ""
      ) {
        newErrors.apellido_materno = ["Por favor ingresa tu apellido materno"];
      }
      if (!formData.email || formData.email.trim() === "") {
        newErrors.email = ["Por favor ingresa tu correo electrónico"];
      } else if (emailExists) {
        newErrors.email = ["Este correo electrónico ya está registrado"];
      }
      if (!formData.telefono || formData.telefono.trim() === "") {
        newErrors.telefono = ["Por favor ingresa tu número de teléfono"];
      }
    }

    // Validación del Paso 2
    if (currentStep === 2) {
      if (!formData.fecha_nacimiento) {
        newErrors.fecha_nacimiento = [
          "Por favor selecciona tu fecha de nacimiento (mayor de edad)",
        ];
      }
      if (!formData.curp || formData.curp.trim() === "") {
        newErrors.curp = ["Por favor ingresa tu CURP"];
      } else if (curpExists) {
        newErrors.curp = ["Este CURP ya está registrado"];
      } else if (formData.curp.length !== 18) {
        newErrors.curp = ["El CURP debe tener 18 caracteres"];
      }
      if (!formData.ocupacion || formData.ocupacion.trim() === "") {
        newErrors.ocupacion = ["Por favor selecciona tu ocupación"];
      }
    }

    // Validación del Paso 3
    if (currentStep === 3) {
      if (!formData.password || formData.password.trim() === "") {
        newErrors.password = ["Ingresa una contraseña"];
        setPasswordError("Ingresa una contraseña valida");
      } else if (
        !passwordRequirements.minLength ||
        !passwordRequirements.hasUpperCase ||
        !passwordRequirements.hasLowerCase ||
        !passwordRequirements.hasNumber
      ) {
        newErrors.password = [
          "La contraseña debe cumplir todos los requisitos",
        ];
        setPasswordError("La contraseña debe cumplir todos los requisitos");
      }

      if (!formData.confirmPassword || formData.confirmPassword.trim() === "") {
        newErrors.confirmPassword = [
          "Ingresa la confirmación de la contraseña",
        ];
        setConfirmPasswordError("Ingresa la confirmación de la contraseña");
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = ["Las contraseñas no coinciden"];
        setConfirmPasswordError("Las contraseñas no coinciden");
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = ["Debes aceptar los términos y condiciones"];
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = ["Debes aceptar la política de privacidad"];
      }
    }

    // Si hay errores, mostrarlos y retornar false
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Fecha en calendario sin que se regrese
  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  // Ir al siguiente paso
  // 🔢 ajusta este número al paso donde está el correo
  const EMAIL_STEP = 1;

  // Ir al siguiente paso
  const handleNextStep = async () => {
    // 1. Validar el paso actual
    const isValid = validateCurrentStep();
    if (!isValid) return;

    // 2. Si estamos en el paso del correo, verificarlo
    if (currentStep === EMAIL_STEP) {
      const exists = await checkEmailExists(formData.email || "");

      // 3. Si el correo ya existe, NO avanzamos
      if (exists) return;
    }

    // 4. Si todo ok, avanzamos
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  // Ir al paso anterior
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    // Validar el paso actual antes de enviar
    if (!validateCurrentStep()) {
      return;
    }

    const result = registroAdoptanteSchema.safeParse(formData);
    if (!result.success) {
      return;
    }

    // Verificación final del email antes de enviar
    if (emailExists) {
      setErrors({
        general: ["El correo electrónico ya está registrado"],
      });
      return;
    }

    // Verificación final del CURP antes de enviar
    if (curpExists) {
      setErrors({
        general: ["El CURP ya está registrado"],
      });
      return;
    }

    setIsLoading(true);

    try {
      // ==========================================================
      // 1️⃣ REGISTRAR USUARIO (Tu endpoint /api/auth/register)
      // ==========================================================
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en el registro");

      // ==========================================================
      // 2️⃣ El correo de confirmación lo envía /api/auth/register
      //    server-side. El link NUNCA llega al cliente.
      // 3️⃣ REDIRECCIÓN FINAL
      // ==========================================================
      localStorage.setItem("registro_email", formData.email || "");
      localStorage.setItem("registro_nombre", formData.nombres || "");

      router.push("/pendiente");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante el registro";

      setErrors({ general: [errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para mostrar un requisito de contraseña
  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="h-4 w-4 text-impa-600" />
      ) : (
        <X className="h-4 w-4 text-rose-500" />
      )}
      <span className={cn("text-sm", met ? "text-impa-700" : "text-impa-muted")}>
        {text}
      </span>
    </div>
  );

  // Paso 1: Datos personales
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-impa-text-strong">Datos Personales</h2>
        <p className="text-sm text-impa-muted">
          Información básica y de contacto
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombres" className="text-impa-text font-semibold text-sm">
          Nombres <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-5 w-5 pointer-events-none" />
          <Input
            id="nombres"
            value={formData.nombres || ""}
            onChange={(e) => handleInputChange("nombres", e.target.value)}
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.nombres?.length > 0 && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="Ej: Juan Carlos"
            disabled={isLoading}
          />
        </div>
        {errors.nombres?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_paterno" className="text-impa-text font-semibold text-sm">
          Apellido Paterno <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4" />
          <Input
            id="apellido_paterno"
            value={formData.apellido_paterno || ""}
            onChange={(e) =>
              handleInputChange("apellido_paterno", e.target.value)
            }
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.apellido_paterno?.length > 0 && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="Ej: García"
            disabled={isLoading}
          />
        </div>
        {errors.apellido_paterno?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_materno" className="text-impa-text font-semibold text-sm">
          Apellido Materno <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4" />
          <Input
            id="apellido_materno"
            value={formData.apellido_materno || ""}
            onChange={(e) =>
              handleInputChange("apellido_materno", e.target.value)
            }
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.apellido_materno?.length > 0 && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="Ej: García"
            disabled={isLoading}
          />
        </div>
        {errors.apellido_materno?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-impa-text font-semibold text-sm">
          Correo Electrónico <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4" />
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={(e) => checkEmailExists(e.target.value)}
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              (errors.email?.length > 0 || emailExists) && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-impa-line border-t-impa-600 rounded-full" />
            </div>
          )}
        </div>
        {emailExists && (
          <div className="flex items-start space-x-2 text-rose-500">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Este correo electrónico ya está registrado.{" "}
              <a href="/login" className="underline hover:text-rose-700 font-semibold">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        )}
        {!emailExists &&
          errors.email?.map((error, index) => (
            <p key={index} className="text-sm text-rose-500">
              {error}
            </p>
          ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono" className="text-impa-text font-semibold text-sm">
          Teléfono <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4" />
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono || ""}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.telefono?.length > 0 && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="555 123 4567"
            disabled={isLoading}
          />
        </div>
        {errors.telefono?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  // Paso 2: Información adicional
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-impa-text-strong">Información Adicional</h2>
        <p className="text-sm text-impa-muted">
          Datos complementarios requeridos
        </p>
      </div>

      {/* === FECHA DE NACIMIENTO === */}
      <div className="space-y-2">
        <Label htmlFor="fecha_nacimiento" className="text-impa-text font-semibold text-sm">
          Fecha de Nacimiento <span className="text-rose-500">*</span>
        </Label>

        {/* === VALIDACIÓN DE EDAD === */}
        {(() => {
          const validarEdad = (date: Date) => {
            const today = new Date();
            let edad = today.getFullYear() - date.getFullYear();
            const m = today.getMonth() - date.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
              edad--;
            }

            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.fecha_nacimiento;

              if (edad < 18) {
                newErrors.fecha_nacimiento = [
                  "Debes ser mayor de 18 años para registrarte.",
                ];
              } else if (edad > 100) {
                newErrors.fecha_nacimiento = [
                  "La edad ingresada no es válida (máximo 100 años).",
                ];
              }

              return newErrors;
            });
          };

          (window as any).validarEdad = validarEdad;
          return null;
        })()}

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4 z-10 pointer-events-none" />

          <DatePicker
            selected={
              formData.fecha_nacimiento
                ? parseLocalDate(formData.fecha_nacimiento)
                : null
            }
            onChange={(date: Date | null) => {
              if (!date) {
                handleInputChange("fecha_nacimiento", "");
                return;
              }

              (window as any).validarEdad(date);

              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, "0");
              const d = String(date.getDate()).padStart(2, "0");

              handleInputChange("fecha_nacimiento", `${y}-${m}-${d}`);
            }}
            onChangeRaw={(e: any) => {
              if (!e?.nativeEvent?.inputType) return;

              const input = e.target as HTMLInputElement;
              if (!input || typeof input.value !== "string") return;

              const formatted = formatFecha(input.value);
              input.value = formatted;

              if (formatted.length === 10) {
                const [dd, mm, yyyy] = formatted.split("/");
                const parsed = new Date(
                  Number(yyyy),
                  Number(mm) - 1,
                  Number(dd)
                );

                handleInputChange("fecha_nacimiento", `${yyyy}-${mm}-${dd}`);

                if (!isNaN(parsed.getTime())) {
                  (window as any).validarEdad(parsed);
                }
              }
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona o escribe tu fecha de nacimiento"
            className={cn(
              "w-full pl-10 pr-10 py-2 border rounded-xl transition-all",
              "hover:border-impa-500 focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:outline-none",
              errors.fecha_nacimiento?.length > 0
                ? "border-rose-500"
                : "border-impa-line"
            )}
            wrapperClassName="w-full"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Calendar className="h-4 w-4 text-impa-600 opacity-60" />
          </div>
        </div>

        <p className="text-xs text-impa-muted">
          Selecciona tu fecha de nacimiento del calendario
        </p>

        {errors.fecha_nacimiento?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="curp" className="text-impa-text font-semibold text-sm">
          CURP <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4" />
          <Input
            id="curp"
            value={formData.curp || ""}
            onChange={(e) =>
              handleInputChange("curp", e.target.value.toUpperCase())
            }
            onBlur={(e) => checkCurpExists(e.target.value)}
            className={cn(
              "pl-10 rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              (errors.curp?.length > 0 || curpExists) && "border-rose-500 focus-visible:ring-rose-500/20"
            )}
            placeholder="GABC800101HDFRRR01"
            maxLength={18}
            disabled={isLoading}
          />
          {isCheckingCurp && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-impa-line border-t-impa-600 rounded-full" />
            </div>
          )}
        </div>
        {curpExists && (
          <div className="flex items-start space-x-2 text-rose-500">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">Este CURP ya está registrado</p>
          </div>
        )}
        {!curpExists &&
          errors.curp?.map((error, index) => (
            <p key={index} className="text-sm text-rose-500">
              {error}
            </p>
          ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ocupacion" className="text-impa-text font-semibold text-sm">
          Ocupación <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-impa-muted h-4 w-4 z-10 pointer-events-none" />
          <select
            id="ocupacion"
            value={formData.ocupacion || ""}
            onChange={(e) => handleInputChange("ocupacion", e.target.value)}
            className={cn(
              "w-full pl-10 pr-10 py-2.5 border rounded-xl appearance-none cursor-pointer",
              "bg-white transition-all",
              "hover:border-impa-500 focus:border-impa-500 focus:ring-4 focus:ring-impa-500/15 focus:outline-none",
              "text-sm text-impa-text",
              errors.ocupacion?.length > 0
                ? "border-rose-500"
                : "border-impa-line",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            <option value="" disabled>
              Selecciona una ocupación
            </option>
            <option value="Estudiante">Estudiante</option>
            <option value="Empleado">Empleado</option>
            <option value="Emprendedor">Emprendedor</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Jubilado">Jubilado</option>
            <option value="Desempleado">Desempleado</option>
            <option value="Otro">Otro</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="h-4 w-4 text-impa-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {errors.ocupacion?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  // Paso 3: Contraseña y términos
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-impa-text-strong">Seguridad y Términos</h2>
        <p className="text-sm text-impa-muted">
          Configura tu contraseña y acepta los términos
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-impa-text font-semibold text-sm">
          Contraseña <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={(e) => validatePassword(e.target.value)}
            className={cn(
              "rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.password?.length > 0 || passwordError
                ? "border-rose-500"
                : ""
            )}
            placeholder="Mínimo 8 caracteres"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-impa-muted"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Indicadores de requisitos en tiempo real */}
        {showRequirements && (
          <div className="mt-3 p-4 bg-impa-50/40 rounded-xl space-y-2 border border-impa-100">
            <p className="text-xs font-semibold text-impa-text mb-2">
              Requisitos de la contraseña:
            </p>
            <RequirementItem
              met={passwordRequirements.minLength}
              text="Mínimo 8 caracteres"
            />
            <RequirementItem
              met={passwordRequirements.hasUpperCase}
              text="Al menos una letra mayúscula"
            />
            <RequirementItem
              met={passwordRequirements.hasLowerCase}
              text="Al menos una letra minúscula"
            />
            <RequirementItem
              met={passwordRequirements.hasNumber}
              text="Al menos un número"
            />
          </div>
        )}

        {passwordError && (
          <div className="flex items-start space-x-2 text-rose-500">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{passwordError}</p>
          </div>
        )}
        {!passwordError &&
          errors.password?.map((error, index) => (
            <p key={index} className="text-sm text-rose-500">
              {error}
            </p>
          ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-impa-text font-semibold text-sm">
          Confirmar Contraseña <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ""}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            onBlur={(e) => validateConfirmPassword(e.target.value)}
            className={cn(
              "rounded-xl focus-visible:ring-impa-500/20 focus-visible:border-impa-500 transition-all",
              errors.confirmPassword?.length > 0 || confirmPasswordError
                ? "border-rose-500"
                : ""
            )}
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-impa-muted"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {confirmPasswordError && (
          <div className="flex items-start space-x-2 text-rose-500">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{confirmPasswordError}</p>
          </div>
        )}
        {!confirmPasswordError &&
          errors.confirmPassword?.map((error, index) => (
            <p key={index} className="text-sm text-rose-500">
              {error}
            </p>
          ))}
      </div>

      <div className="space-y-3 pt-4">
        {/* Términos */}
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms || false}
              onChange={(e) =>
                handleInputChange("acceptTerms", e.target.checked)
              }
              className="data-[state=checked]:bg-impa-600 data-[state=checked]:border-impa-600"
            />
          </div>

          <div className="text-sm">
            <Label htmlFor="acceptTerms" className="cursor-pointer text-impa-text">
              Acepto los{" "}
              <button
                type="button"
                className="text-impa-600 font-medium hover:underline"
                onClick={() => setShowTerminosModal(true)}
              >
                términos y condiciones
              </button>
              <span className="text-rose-500 ml-1">*</span>
            </Label>
          </div>
        </div>

        {errors.acceptTerms?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500 ml-7">
            {error}
          </p>
        ))}

        {/* Privacidad */}
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <Checkbox
              id="acceptPrivacy"
              checked={formData.acceptPrivacy || false}
              onChange={(e) =>
                handleInputChange("acceptPrivacy", e.target.checked)
              }
              className="data-[state=checked]:bg-impa-600 data-[state=checked]:border-impa-600"
            />
          </div>

          <div className="text-sm">
            <Label htmlFor="acceptPrivacy" className="cursor-pointer text-impa-text">
              Acepto la{" "}
              <button
                type="button"
                className="text-impa-600 font-medium hover:underline"
                onClick={() => setShowPrivacidadModal(true)}
              >
                política de privacidad
              </button>
              <span className="text-rose-500 ml-1">*</span>
            </Label>
          </div>
        </div>

        <TerminosModal
          open={showTerminosModal}
          onClose={() => setShowTerminosModal(false)}
        />

        <PoliticaPrivacidadModal
          open={showPrivacidadModal}
          onClose={() => setShowPrivacidadModal(false)}
        />

        {errors.acceptPrivacy?.map((error, index) => (
          <p key={index} className="text-sm text-rose-500 ml-7">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <Card elevated className="w-full max-w-md mx-auto rounded-2xl p-2 impa-highlight-top">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-impa-50 border border-impa-200 text-[10px] font-bold uppercase tracking-wider text-impa-700">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-xs text-impa-muted font-medium">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-impa-text-strong tracking-tight mt-2">
          Crea tu cuenta
        </CardTitle>
        <CardDescription className="text-impa-muted mt-1">
          Unos pasos para comenzar tu proceso de adopción responsable.
        </CardDescription>

        {/* Indicador de progreso */}
        <div className="flex gap-2 pt-5">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-all duration-500 ease-impa-out",
                step <= currentStep
                  ? "bg-gradient-to-r from-impa-500 to-impa-600 shadow-impa-ring-soft"
                  : "bg-impa-surface-3"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Errores generales */}
          {errors.general?.map((error, index) => (
            <div
              key={index}
              className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl"
            >
              <p className="text-sm font-medium text-rose-700 text-center">{error}</p>
            </div>
          ))}

          {/* Botones de navegación */}
          <div className="flex items-center justify-between pt-8 gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="cta"
                size="lg"
                onClick={handleNextStep}
                disabled={
                  isLoading ||
                  isCheckingEmail ||
                  emailExists ||
                  isCheckingCurp ||
                  curpExists ||
                  (errors.fecha_nacimiento?.length ?? 0) > 0
                }
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="cta"
                size="lg"
                onClick={handleSubmit}
                disabled={
                  isLoading || !!passwordError || !!confirmPasswordError
                }
              >
                {isLoading ? "Registrando..." : "Crear cuenta"}
              </Button>
            )}
          </div>

          {/* Enlace de inicio de sesión */}
          <div className="mt-8 pt-6 border-t border-impa-line text-center">
            <p className="text-sm text-impa-muted">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-impa-600 font-semibold hover:text-impa-700 hover:underline transition-colors duration-150 ml-1 cursor-pointer"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}