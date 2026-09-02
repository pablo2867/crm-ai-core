import LeadDetailsModal from "@/components/LeadDetailsModal";
import EditLeadModal from "@/components/EditLeadModal";
import AIModal from "@/components/AIModal";

export default function LeadCardModals({
  lead,
  open,
  setOpen,
  editOpen,
  setEditOpen,
  aiOpen,
  setAiOpen,
  aiText,
}: any) {
  return (
    <>
      {open && (
        <LeadDetailsModal
          key={lead.id}
          lead={lead}
          open={open}
          onClose={() =>
            setOpen(false)
          }
        />
      )}

      {editOpen && (
        <EditLeadModal
          lead={lead}
          open={editOpen}
          onClose={() =>
            setEditOpen(false)
          }
        />
      )}

      {aiOpen && (
        <AIModal
          open={aiOpen}
          onClose={() =>
            setAiOpen(false)
          }
          text={aiText}
        />
      )}
    </>
  );
}