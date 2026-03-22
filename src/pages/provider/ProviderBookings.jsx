import { useAppSelector } from "../../redux/hook";
import BookingCard from "../../components/BookingCard";
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";

export default function ProviderBookings() {
  const { parkings = [] } = useAppSelector((s) => s.parking);
  const { bookings = [] } = useAppSelector((s) => s.booking);
  const { user } = useAppSelector((s) => s.auth);

  const myParkingIds = parkings
    .filter((p) => p.providerId === user?.id)
    .map((p) => p.id);

  const myBookings = bookings.filter((b) =>
    myParkingIds.includes(b.parkingId)
  );

  const activeBookings = myBookings.filter(b => b.status === "active").length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bookings
        </h2>
        <p className="text-gray-500 mt-1">
          Track and manage bookings for your parking spaces
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Total Bookings</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {myBookings.length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-600 mt-1">
            {activeBookings}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {myBookings.length - activeBookings}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <StaggerContainer>
        <StaggerItem>
          {myBookings.length > 0 ? (
            <div className="grid gap-4">
              {myBookings.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow">
              <p className="text-gray-500">
                No bookings yet
              </p>
            </div>
          )}
        </StaggerItem>
      </StaggerContainer>

    </div>
  );
}