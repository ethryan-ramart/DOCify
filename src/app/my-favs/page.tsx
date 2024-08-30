import DocumentsGrid from "@/components/explore/DocumentsGrid";
import { getUserFavDocuments } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const documents = await getUserFavDocuments()
  
  return (
    <div className="flex flex-col items-center justify-center">
      <DocumentsGrid documents={documents}/>
    </div>
  );
}
