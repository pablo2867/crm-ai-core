"use client";

import {
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast }
from "sonner";

import {
  Plus,
  X,
} from "lucide-react";

import { createLead }
from "@/actions/createLead";

export default function CreateLeadForm() {

  const formRef =
    useRef<HTMLFormElement>(null);

  const [open, setOpen] =
    useState(false);

  const router =
    useRouter();

  async function handleSubmit(
    formData: FormData
  ) {

    const result =
      await createLead(formData);

    if (result.success) {

      toast.success(
        result.message
      );

      formRef.current?.reset();

      setOpen(false);

      router.refresh();

    } else {

      toast.error(
        result.message
      );

    }

  }

  return (
    <>

      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          flex items-center gap-2
          bg-blue-600 hover:bg-blue-700
          text-white
          px-5 py-3
          rounded-2xl
          shadow-xl
          transition-all duration-300
        "
      >

        <Plus size={18} />

        Nuevo Lead

      </button>

      {
        open && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/40
              backdrop-blur-sm
              p-4
            "
          >

            <div
              className="
                w-full max-w-2xl
                rounded-3xl
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                p-8
                shadow-2xl
              "
            >

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-zinc-500 text-sm">
                    CRM AI
                  </p>

                  <h2 className="text-3xl font-black text-black dark:text-white mt-2">
                    Nuevo Lead
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-zinc-100 dark:bg-zinc-900
                    flex items-center justify-center
                    text-black dark:text-white
                  "
                >

                  <X size={20} />

                </button>

              </div>

              <form
                ref={formRef}
                action={handleSubmit}
                className="
                  grid grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                <input
                  name="name"
                  placeholder="Nombre"
                  className="
                    bg-white dark:bg-[#18181B]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-2xl
                    px-4 py-4
                    text-black dark:text-white
                  "
                />

                <input
                  name="company"
                  placeholder="Empresa"
                  className="
                    bg-white dark:bg-[#18181B]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-2xl
                    px-4 py-4
                    text-black dark:text-white
                  "
                />

                <input
                  name="email"
                  placeholder="Email"
                  className="
                    bg-white dark:bg-[#18181B]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-2xl
                    px-4 py-4
                    text-black dark:text-white
                  "
                />

                <select
                  name="status"
                  className="
                    bg-white dark:bg-[#18181B]
                    border border-zinc-200 dark:border-zinc-800
                    rounded-2xl
                    px-4 py-4
                    text-black dark:text-white
                  "
                >

                  <option>
                    Nuevo
                  </option>

                  <option>
                    Contactado
                  </option>

                  <option>
                    Cerrado
                  </option>

                </select>

                <button
                  className="
                    md:col-span-2
                    bg-blue-600 hover:bg-blue-700
                    text-white
                    rounded-2xl
                    py-4
                    font-medium
                    transition-all duration-300
                    shadow-xl
                  "
                >
                  Guardar Lead
                </button>

              </form>

            </div>

          </div>
        )
      }

    </>
  );
}