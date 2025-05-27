import { ItemType } from "@/src/types/types";
import { highlightText } from "@/src/utils/highlightText";

type Props = {
  isnadTransmitters: ItemType[];
  highlight?: string;
};

export function Isnad({ isnadTransmitters, highlight }: Props) {
  if (!isnadTransmitters || isnadTransmitters.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col items-start">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
        Isnad :
      </span>
      <div className="flex flex-wrap items-center gap-0">
        {isnadTransmitters.map((trans, idx) => (
          <div
            key={trans.id}
            className={`
              relative flex items-center
              ${idx !== 0 ? "-ml-4" : ""}
              z-${10 - idx}
            `}
            style={{
              marginLeft: idx === 0 ? 0 : -24,
            }}
          >
            <div
              className={`
                px-4 py-1
                bg-emerald-50 dark:bg-emerald-900/60
                border border-emerald-200 dark:border-emerald-800
                rounded-xl
                text-xs font-medium
                text-emerald-800 dark:text-emerald-200
                shadow
                transition
                flex items-center
                relative
                group
                ${idx !== 0 ? "clip-ariane" : ""}
              `}
              style={{
                clipPath:
                  idx === 0
                    ? undefined
                    : "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)",
                background:
                  idx === 0
                    ? undefined
                    : "linear-gradient(90deg,rgba(16,185,129,0.08) 0%,rgba(16,185,129,0.18) 100%)",
                borderLeft: idx === 0 ? undefined : "none",
                borderTopLeftRadius: idx === 0 ? "0.75rem" : 0,
                borderBottomLeftRadius: idx === 0 ? "0.75rem" : 0,
                borderTopRightRadius: "0.75rem",
                borderBottomRightRadius: "0.75rem",
              }}
            >
              <span>{highlightText(trans.name, highlight)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
