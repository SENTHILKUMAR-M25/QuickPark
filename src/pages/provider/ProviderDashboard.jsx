import StatCard from '../../components/StatCard';
import { useAppSelector } from '../../redux/hook';
import { LayoutDashboard, Car, Calendar, DollarSign } from 'lucide-react';
import BookingCard from '../../components/BookingCard';
import StaggerContainer, { StaggerItem } from '../../components/StaggerContainer';

export default function ProviderDashboard() {
  const { parkings } = useAppSelector(s => s.parking);
  const { bookings } = useAppSelector(s => s.booking);
  const { user } = useAppSelector(s => s.auth);

  const myParkings = parkings.filter(p => p.providerId === user?.id);
  const myParkingIds = myParkings.map(p => p.id);
  const myBookings = bookings.filter(b => myParkingIds.includes(b.parkingId));
  const totalEarnings = myBookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem><h2 className="font-display text-2xl font-bold">Provider Dashboard</h2></StaggerItem>
      <StaggerItem>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Parkings" value={myParkings.length} icon={Car} />
          <StatCard title="Active Bookings" value={myBookings.filter(b => b.status === 'active').length} icon={Calendar} />
          <StatCard title="Total Bookings" value={myBookings.length} icon={LayoutDashboard} />
          <StatCard title="Total Earnings" value={`₹${totalEarnings}`} icon={DollarSign} />
        </div>
      </StaggerItem>
      <StaggerItem>
        <h3 className="font-display font-semibold text-lg">Recent Bookings</h3>
        <div className="grid gap-4 mt-3">
          {myBookings.length > 0 ? myBookings.slice(0, 5).map(b => (
            <BookingCard key={b.id} booking={b} />
          )) : <p className="text-sm text-muted-foreground">No bookings yet.</p>}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
