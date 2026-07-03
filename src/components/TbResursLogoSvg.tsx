import React from 'react';

interface TbResursLogoSvgProps {
  className?: string;
  showText?: boolean;
  title?: string;
  subtitle?: string;
}

export const TbResursLogoSvg: React.FC<TbResursLogoSvgProps> = ({
  className = "h-11 w-auto",
  showText = true,
  title = "ТБ-Ресурс",
  subtitle = "Завод в Татарстане"
}) => {
  return (
    <svg 
      viewBox={showText ? "0 0 310 80" : "0 0 120 120"} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <g transform={showText ? "translate(0, -6) scale(0.72)" : undefined}>
        {/* Green upper-left sweeping crescent arc */}
        <path
          d="M 28,82 C 16,68 18,44 32,28 C 46,12 70,8 88,20 C 83,12 68,6 50,10 C 26,16 12,42 22,78 Z"
          fill="#73bd31"
        />
        <path
          d="M 45,95 C 36,92 28,84 25,75 C 28,86 38,96 52,98 Z"
          fill="#73bd31"
        />

        {/* Dark Slate rubber mat right crescent with puzzle teeth */}
        <path
          d="M 68,14 L 75,20 C 86,30 92,44 91,58 L 96,59 C 98,59 100,61 100,63.5 C 100,66 98,68 96,68 L 90,69 C 88,77 84,84 78,90 L 82,93 C 83.5,94.5 83.5,97 82,98.5 C 80.5,100 78,100 76.5,98.5 L 72,94 C 66,97 59,98 52,98 L 51,92 C 59,92 66,89 72,85 C 81,77 85,65 84,52 C 83,38 76,27 68,19 Z"
          fill="#333e48"
        />

        {/* Puzzle interlocking gear teeth along right rubber mat */}
        <path d="M 86,28 C 89,28 92,30 93,33 C 94,36 92,39 89,39 L 87,35 Z" fill="#333e48" />
        <path d="M 91,42 C 95,43 98,46 98,49 C 98,53 95,55 91,54 L 90,48 Z" fill="#333e48" />
        <path d="M 87,70 C 91,72 93,76 92,79 C 90,83 86,84 83,82 L 85,76 Z" fill="#333e48" />

        {/* Rubber mat studded texture (circles) */}
        <circle cx="75" cy="28" r="2.8" fill="#4d5b6a" />
        <circle cx="81" cy="36" r="2.8" fill="#4d5b6a" />
        <circle cx="75" cy="38" r="2.8" fill="#4d5b6a" />
        <circle cx="83" cy="46" r="2.8" fill="#4d5b6a" />
        <circle cx="76" cy="48" r="2.8" fill="#4d5b6a" />
        <circle cx="83" cy="56" r="2.8" fill="#4d5b6a" />
        <circle cx="76" cy="58" r="2.8" fill="#4d5b6a" />
        <circle cx="81" cy="66" r="2.8" fill="#4d5b6a" />
        <circle cx="74" cy="67" r="2.8" fill="#4d5b6a" />
        <circle cx="77" cy="75" r="2.8" fill="#4d5b6a" />
        <circle cx="71" cy="76" r="2.8" fill="#4d5b6a" />
        <circle cx="71" cy="84" r="2.8" fill="#4d5b6a" />
        <circle cx="65" cy="83" r="2.8" fill="#4d5b6a" />
        <circle cx="64" cy="74" r="2.8" fill="#4d5b6a" />
        <circle cx="68" cy="65" r="2.8" fill="#4d5b6a" />
        <circle cx="68" cy="55" r="2.8" fill="#4d5b6a" />
        <circle cx="68" cy="45" r="2.8" fill="#4d5b6a" />
        <circle cx="67" cy="35" r="2.8" fill="#4d5b6a" />

        {/* Cow head silhouette and realistic features */}
        {/* Ears */}
        <path d="M 38,28 C 24,24 16,30 20,38 C 24,42 32,38 40,33 Z" fill="#242c33" />
        <path d="M 70,28 C 84,24 92,30 88,38 C 84,42 76,38 68,33 Z" fill="#242c33" />
        {/* Inner ears */}
        <path d="M 33,30 C 25,28 21,32 24,36 C 27,38 32,35 36,32 Z" fill="#717c87" />
        <path d="M 75,30 C 83,28 87,32 84,36 C 81,38 76,35 72,32 Z" fill="#717c87" />

        {/* Main skull silhouette */}
        <path d="M 40,30 C 45,22 63,22 68,30 C 72,36 74,52 68,66 C 65,74 61,78 54,78 C 47,78 43,74 40,66 C 34,52 36,36 40,30 Z" fill="#242c33" />

        {/* White face blaze */}
        <path d="M 47,26 C 50,24 58,24 61,26 C 63,32 58,48 59,58 C 59,64 57,68 54,68 C 51,68 49,64 49,58 C 50,48 45,32 47,26 Z" fill="#ffffff" />

        {/* Left eye patch & eye */}
        <path d="M 38,36 C 44,38 45,46 41,50 C 37,50 36,44 38,36 Z" fill="#242c33" />
        <circle cx="41" cy="42" r="2.2" fill="#111518" />
        <circle cx="41.6" cy="41.2" r="0.7" fill="#ffffff" />

        {/* Right eye patch & eye */}
        <path d="M 70,36 C 64,38 63,46 67,50 C 71,50 72,44 70,36 Z" fill="#242c33" />
        <circle cx="67" cy="42" r="2.2" fill="#111518" />
        <circle cx="66.4" cy="41.2" r="0.7" fill="#ffffff" />

        {/* Muzzle */}
        <path d="M 41,64 C 41,59 67,59 67,64 C 68,71 63,77 54,77 C 45,77 40,71 41,64 Z" fill="#ffffff" />
        <path d="M 43,65 C 43,61 65,61 65,65 C 66,70 62,75 54,75 C 46,75 42,70 43,65 Z" fill="#2d363f" />

        {/* Nostrils */}
        <ellipse cx="48" cy="67" rx="2.2" ry="3" fill="#111518" transform="rotate(-15 48 67)" />
        <ellipse cx="60" cy="67" rx="2.2" ry="3" fill="#111518" transform="rotate(15 60 67)" />

        {/* Muzzle highlight line */}
        <path d="M 48,72 Q 54,74 60,72" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {showText && (
        <g transform="translate(86, 0)">
          <text x="0" y="52" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="38" letterSpacing="-0.5">
            {(!title || title === "ТБ-Ресурс") ? (
              <>
                <tspan fill="#6bc233">ТБ-</tspan>
                <tspan fill="currentColor">Ресурс</tspan>
              </>
            ) : (
              <tspan fill="#6bc233">{title}</tspan>
            )}
          </text>
        </g>
      )}
    </svg>
  );
};
