export const WHATSAPP_PHONE = "966506157964"; // 05... local -> international
export const WHATSAPP_LINK_BASE = `https://wa.me/${WHATSAPP_PHONE}`;

export function whatsappUrl(text: string) {
  return `${WHATSAPP_LINK_BASE}?text=${encodeURIComponent(text)}`;
}