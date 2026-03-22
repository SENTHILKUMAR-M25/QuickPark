import React from 'react';

export default function SlotGrid({
  slots,
  cols = 8,
  selectedSlot,
  onSelectSlot,
  interactive = true,
}) {

  const getSlotStyle = (slot) => {
    if (slot.id === selectedSlot) {
      return "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105";
    }

    switch (slot.status) {
      case "available":
        return "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 cursor-pointer";
      case "booked":
        return "bg-red-100 text-red-600 border border-red-300 cursor-not-allowed opacity-70";
      case "reserved":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300 cursor-not-allowed opacity-80";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="space-y-5">

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-400" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-400" /> Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-yellow-400" /> Reserved
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-purple-500" /> Selected
        </span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(cols, slots.length)}, minmax(0, 1fr))`,
        }}
      >
        {slots.map((slot) => {
          const isDisabled = !interactive || slot.status !== "available";

          return (
            <button
              key={slot.id}
              disabled={isDisabled}
              onClick={() =>
                !isDisabled && onSelectSlot?.(slot.id)
              }
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${getSlotStyle(slot)}`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}