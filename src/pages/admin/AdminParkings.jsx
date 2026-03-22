import { useAppSelector, useAppDispatch } from "../../redux/hook";
import ParkingCard from "../../components/ParkingCard";
import { Button } from "../../components/ui/Button";
import { Trash2 } from "lucide-react";
import { removeParking } from "../../redux/slices/parkingSlice";
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";

export default function AdminParkings() {
  const { parkings = [] } = useAppSelector((state) => state.parking);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Parking Locations
        </h2>
        <p className="text-gray-500 mt-1">
          Manage all listed parking spaces
        </p>
      </div>

      {/* Content */}
      {parkings.length === 0 ? (
        <div className="text-center py-16 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">
            No parking locations available
          </p>
        </div>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {parkings.map((parking) => (
              <StaggerItem key={parking.id}>
                <div className="relative group">

                  {/* Card */}
                  <ParkingCard parking={parking} />

                  {/* Delete Button */}
                  <Button
                    size="icon"
                    className="absolute top-3 left-3 bg-white/80 backdrop-blur-md hover:bg-red-100 shadow-md rounded-xl opacity-0 group-hover:opacity-100 transition"
                    onClick={() => dispatch(removeParking(parking.id))}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>

                </div>
              </StaggerItem>
            ))}

          </div>
        </StaggerContainer>
      )}

    </div>
  );
}