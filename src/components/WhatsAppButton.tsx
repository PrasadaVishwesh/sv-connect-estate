import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '918099952200';
  const message = encodeURIComponent('Hi! I am interested in your real estate services. Please help me find a property.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5C] text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="font-semibold hidden sm:inline">Chat with us</span>
    </a>
  );
}
