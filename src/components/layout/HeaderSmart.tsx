import { createClient } from "@/lib/supabase/server";
import HeaderAd from "@/components/layout/HeaderAd";
import HeaderUsr from "@/components/layout/HeaderUsr";
import HeaderPublic from "@/components/layout/Header";

export default async function HeaderSmart() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const rolMeta = session?.user?.app_metadata?.role;

  if (rolMeta === "admin") {
    return (
      <>
        <HeaderAd />
        <div className="h-16" />
      </>
    );
  }

  if (rolMeta === "user") {
    return (
      <>
        <HeaderUsr />
        <div className="h-16" />
      </>
    );
  }

  if (session?.user?.id) {
    const { data } = await supabase
      .from("perfiles")
      .select("rol_id")
      .eq("id", session.user.id)
      .single();

    if (data?.rol_id === 1) {
      return (
        <>
          <HeaderAd />
          <div className="h-16" />
        </>
      );
    }

    if (data?.rol_id === 2) {
      return (
        <>
          <HeaderUsr />
          <div className="h-16" />
        </>
      );
    }
  }

  return <HeaderPublic />;
}
