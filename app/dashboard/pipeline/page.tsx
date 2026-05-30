import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import PipelineBoard
from "@/components/PipelineBoard";

export default async function PipelinePage() {

  const {
    data: leads,
  } = await supabaseAdmin

    .from("leads")

    .select("*");

  const columns = [

    {
      title: "Nuevo",

      leads:
        leads?.filter(
          (lead) =>
            lead.status === "Nuevo"
        ) || [],
    },

    {
      title: "Contactado",

      leads:
        leads?.filter(
          (lead) =>
            lead.status === "Contactado"
        ) || [],
    },

    {
      title: "Propuesta",

      leads:
        leads?.filter(
          (lead) =>
            lead.status === "Propuesta"
        ) || [],
    },

    {
      title: "Negociación",

      leads:
        leads?.filter(
          (lead) =>
            lead.status === "Negociación"
        ) || [],
    },

    {
      title: "Cerrado",

      leads:
        leads?.filter(
          (lead) =>
            lead.status === "Cerrado"
        ) || [],
    },

  ];

  return (

    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          AI Sales Pipeline

        </h1>

        <p className="text-zinc-500">

          Drag & Drop CRM

        </p>

      </div>

      <PipelineBoard
        columns={columns}
      />

    </div>

  );

}