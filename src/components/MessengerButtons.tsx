import React from 'react';
import { Send, MessageCircle, PhoneCall } from 'lucide-react';

interface MessengerButtonsProps {
  phone?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'row' | 'col' | 'wrap';
  showLabels?: boolean;
  className?: string;
}

export const MessengerButtons: React.FC<MessengerButtonsProps> = ({
  phone = "+7 915 638-72-59",
  size = 'md',
  layout = 'row',
  showLabels = true,
  className = ""
}) => {
  const cleanDigits = phone.replace(/[^0-9+]/g, '');
  const cleanNumOnly = cleanDigits.replace('+', '');

  const tgUrl = `https://t.me/+${cleanNumOnly}`;
  const waUrl = `https://wa.me/${cleanNumOnly}`;
  // MAX messenger link / phone trigger
  const maxUrl = `tel:+${cleanNumOnly}`;

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2 rounded-xl font-bold',
    lg: 'px-4 py-3 text-sm sm:text-base gap-2.5 rounded-xl font-bold shadow-md'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  const containerClasses = {
    row: 'flex items-center gap-2',
    col: 'flex flex-col gap-2',
    wrap: 'flex flex-wrap items-center gap-2 sm:gap-3'
  }[layout];

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Telegram */}
      <a
        href={tgUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center bg-[#2AABEE] hover:bg-[#2298D6] text-white transition-all hover:scale-105 active:scale-95 ${sizeClasses}`}
        title="Написать в Telegram"
      >
        <Send className={iconSizes} />
        {showLabels && <span>Telegram</span>}
      </a>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all hover:scale-105 active:scale-95 ${sizeClasses}`}
        title="Написать в WhatsApp"
      >
        <MessageCircle className={iconSizes} />
        {showLabels && <span>WhatsApp</span>}
      </a>

      {/* MAX */}
      <a
        href={maxUrl}
        className={`inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all hover:scale-105 active:scale-95 ${sizeClasses}`}
        title="Написать в MAX мессенджер"
      >
        <PhoneCall className={iconSizes} />
        {showLabels && <span>MAX</span>}
      </a>
    </div>
  );
};
