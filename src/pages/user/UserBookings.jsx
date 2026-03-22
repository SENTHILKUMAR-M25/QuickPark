import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { cancelBooking } from '../../redux/slices/bookingSlice';
import BookingCard from '../../components/BookingCard';
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";

export default function UserBookings() {
  const { bookings } = useAppSelector(s => s.booking);
  const { user } = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const userBookings = bookings.filter(b => b.userId === user?.id);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem><h2 className="font-display text-2xl font-bold">My Bookings</h2></StaggerItem>
      <StaggerItem>
        <div className="grid gap-4">
          {userBookings.length > 0 ? userBookings.map(b => (
            <BookingCard key={b.id} booking={b} showCancel onCancel={id => dispatch(cancelBooking(id))} />
          )) : (
            <div className="glass-card p-8 text-center text-muted-foreground">No bookings found.</div>
          )}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
