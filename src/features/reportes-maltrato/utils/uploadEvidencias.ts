import { createClient } from "@/lib/supabase/client";

const BUCKET = "reportes-maltrato";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function subirEvidenciasReporte(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  if (files.length > 5) {
    throw new Error("Máximo 5 evidencias por reporte.");
  }

  const supabase = createClient();
  const urls: string[] = [];
  const stamp = Date.now();

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `El archivo ${file.name} no es una imagen JPG/PNG/WebP válida.`
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`El archivo ${file.name} supera los 5 MB.`);
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const safe = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const path = `${stamp}_${safe}_${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (error) {
      throw new Error(
        `No se pudo subir ${file.name}: ${error.message}`
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
