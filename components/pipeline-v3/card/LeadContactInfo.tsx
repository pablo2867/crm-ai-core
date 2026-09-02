interface Props {
  email?: string;
  phone?: string;
}

export default function LeadContactInfo({
  email,
  phone,
}: Props) {

  return (

    <>

      <div
        className="
          mt-3
          text-xs
          text-zinc-400
          truncate
        "
      >
        📧 {email}
      </div>

      {phone && (

        <div
          className="
            mt-2
            text-xs
            text-zinc-400
          "
        >
          📞 {phone}
        </div>

      )}

    </>

  );

}