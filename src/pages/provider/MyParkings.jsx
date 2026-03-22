import { useAppSelector } from '../../redux/hook';
import ParkingCard from '../../components/ParkingCard';
import StaggerContainer, { StaggerItem } from '../../components/StaggerContainer';

export default function MyParkings() {
  const { parkings } = useAppSelector(s => s.parking);
  const { user } = useAppSelector(s => s.auth);
  const myParkings = parkings.filter(p => p.providerId === user?.id);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem><h2 className="font-display text-2xl font-bold">My Parking Spaces</h2></StaggerItem>
      <StaggerItem>
        {myParkings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myParkings.map(p => <ParkingCard key={p.id} parking={p} />)}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-muted-foreground">No parking spaces added yet.</div>
        )}
      </StaggerItem>
    </StaggerContainer>
  );
}
