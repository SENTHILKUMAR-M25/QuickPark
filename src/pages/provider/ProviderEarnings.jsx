import { useAppSelector } from '../../redux/hook';
import StatCard from '../../components/StatCard';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import StaggerContainer, { StaggerItem } from '../../components/StaggerContainer';

export default function ProviderEarnings() {
  const { parkings } = useAppSelector(s => s.parking);
  const { bookings } = useAppSelector(s => s.booking);
  const { user } = useAppSelector(s => s.auth);

  const myParkingIds = parkings.filter(p => p.providerId === user?.id).map(p => p.id);
  const myBookings = bookings.filter(b => myParkingIds.includes(b.parkingId) && b.status !== 'cancelled');
  const totalEarnings = myBookings.reduce((s, b) => s + b.amount, 0);
  const avgBooking = myBookings.length > 0 ? Math.round(totalEarnings / myBookings.length) : 0;

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem><h2 className="font-display text-2xl font-bold">Earnings</h2></StaggerItem>
      <StaggerItem>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`₹${totalEarnings}`} icon={DollarSign} trend="+12% this month" />
          <StatCard title="Avg. Booking" value={`₹${avgBooking}`} icon={TrendingUp} />
          <StatCard title="Total Bookings" value={myBookings.length} icon={Calendar} />
          <StatCard title="Active Parkings" value={myParkingIds.length} icon={BarChart3} />
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Booking History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Booking</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
              </tr></thead>
              <tbody>
                {myBookings.map(b => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4">{b.parkingName} - {b.slotLabel}</td>
                    <td className="py-3 px-4">{b.userName}</td>
                    <td className="py-3 px-4">{b.date}</td>
                    <td className="py-3 px-4 text-right font-medium">₹{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
