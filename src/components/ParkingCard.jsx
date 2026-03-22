import { MapPin, Star, Clock, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ParkingCard({ parking }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <Link
        to={`/parking/${parking.id}`}
        className="block rounded-2xl overflow-hidden backdrop-blur-lg bg-white/70 border border-white/30 shadow-md hover:shadow-xl transition-all duration-300"
      >

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={parking.image}
            alt={parking.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            ₹{parking.pricePerHour}/hr
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {parking.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="truncate">
              {parking.address}, {parking.city}
            </span>
          </div>

          {/* Bottom Info */}
          <div className="flex items-center justify-between pt-2">

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-800">
                {parking.rating}
              </span>
            </div>

            {/* Slots + Time */}
            <div className="flex items-center gap-4 text-xs text-gray-500">

              <span className="flex items-center gap-1">
                <Car className="w-4 h-4 text-gray-700" />
                {parking.availableSlots}/{parking.totalSlots}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500" />
                {parking.openTime}-{parking.closeTime}
              </span>

            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}