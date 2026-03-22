import { Calendar, Clock, Car } from 'lucide-react';
import { Button } from './ui/Button';

export default function BookingCard({ booking, onCancel, showCancel = false }) {

  const statusStyles = {
    active: "bg-green-100 text-green-600 border-green-300",
    completed: "bg-blue-100 text-blue-600 border-blue-300",
    cancelled: "bg-red-100 text-red-600 border-red-300",
  };

  return (
    <div className="backdrop-blur-lg bg-white/70 border border-white/30 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {booking.parkingName}
          </h4>
          <p className="text-sm text-gray-500">
            Slot: {booking.slotLabel}
          </p>
        </div>
        
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusStyles[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          {booking.date}
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          {booking.startTime} - {booking.endTime}
        </div>

        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-gray-700" />
          {booking.vehicleNumber}
        </div>

        <div className="font-semibold text-gray-900">
          ₹{booking.amount}
        </div>

      </div>

      {/* Cancel Button */}
      {showCancel && booking.status === 'active' && onCancel && (
        <Button
          size="sm"
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
          onClick={() => onCancel(booking.id)}
        >
          Cancel Booking
        </Button>
      )}

    </div>
  );
}