import { WHATSAPP_URL } from "../../data/contact";
import { WhatsAppIcon } from "../WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[18px] right-[43px] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] shadow-lg shadow-[#25d366]/40 transition hover:scale-110 hover:shadow-[#25d366]/60 lg:bottom-12 lg:right-12 lg:h-14 lg:w-14"
    >
      <WhatsAppIcon className="h-6 w-6 text-white lg:h-7 lg:w-7" />
    </a>
  );
}
