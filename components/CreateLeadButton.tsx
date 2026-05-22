"use client";

import {
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import CreateLeadModal
from "@/components/CreateLeadModal";

export default function CreateLeadButton() {

  const [
    open,
    setOpen,
  ] = useState(false);

  return (

    <>

      <button

        onClick={() =>
          setOpen(true)
        }

        className="
          flex
          items-center
          gap-2

          bg-blue-600
          hover:bg-blue-700

          transition

          text-white

          px-5 py-4

          rounded-2xl

          font-bold

          shadow-xl
        "
      >

        <Plus size={18} />

        Nuevo Lead

      </button>

      {

        open && (

          <CreateLeadModal
            onClose={() =>
              setOpen(false)
            }
          />

        )

      }

    </>

  );

}