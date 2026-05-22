"use client";

import {
  useState,
} from "react";

import {
  X,
} from "lucide-react";

export default function EditLeadModal({
  lead,
  onClose,
}: any) {

  const [
    form,
    setForm,
  ] = useState({

    name:
      lead.name || "",

    email:
      lead.email || "",

    company:
      lead.company || "",

    phone:
      lead.phone || "",

    ai_score:
      lead.ai_score || 0,

    ai_temperature:
      lead.ai_temperature || "WARM",

  });

  const handleSave =
    async () => {

      try {

        await fetch(
          "/api/update-lead",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              id: lead.id,

              ...form,

            }),

          }
        );

        onClose();

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm

        flex
        items-center
        justify-center

        z-[999]
      "
    >

      <div
        className="
          w-full
          max-w-2xl

          bg-white
          dark:bg-[#111113]

          rounded-3xl

          p-8

          border
          border-zinc-200
          dark:border-zinc-800
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            mb-8
          "
        >

          <div>

            <p className="text-zinc-500 text-sm">
              CRM AI
            </p>

            <h2
              className="
                text-3xl
                font-black
                text-black
                dark:text-white
              "
            >
              Editar Lead
            </h2>

          </div>

          <button
            onClick={onClose}
          >

            <X />

          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <input
            placeholder="Nombre"

            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          />

          <input
            placeholder="Email"

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          />

          <input
            placeholder="Empresa"

            value={form.company}

            onChange={(e) =>
              setForm({
                ...form,
                company:
                  e.target.value,
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          />

          <input
            placeholder="Teléfono"

            value={form.phone}

            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          />

          <input
            type="number"

            placeholder="AI Score"

            value={form.ai_score}

            onChange={(e) =>
              setForm({
                ...form,
                ai_score:
                  Number(
                    e.target.value
                  ),
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          />

          <select

            value={
              form.ai_temperature
            }

            onChange={(e) =>
              setForm({
                ...form,
                ai_temperature:
                  e.target.value,
              })
            }

            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              px-4 py-4

              outline-none
            "
          >

            <option>
              HOT
            </option>

            <option>
              WARM
            </option>

            <option>
              COLD
            </option>

          </select>

        </div>

        <div
          className="
            flex
            justify-end

            mt-8
          "
        >

          <button

            onClick={handleSave}

            className="
              bg-blue-600
              hover:bg-blue-700

              text-white

              px-6 py-4

              rounded-2xl

              font-bold
            "
          >

            Guardar Cambios

          </button>

        </div>

      </div>

    </div>

  );

}