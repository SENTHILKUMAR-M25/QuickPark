import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { addParking } from "../../redux/slices/parkingSlice";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddParking() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    type: "both",
    totalSlots: 16,
    pricePerHour: 40,
    openTime: "06:00",
    closeTime: "22:00",
    image: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const slots = [];
    const cols = 8;
    const rows = Math.ceil(form.totalSlots / cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols && slots.length < form.totalSlots; c++) {
        const row = String.fromCharCode(65 + r);
        slots.push({
          id: `${row}${c}`,
          label: `${row}${c}`,
          status: "available",
        });
      }
    }

    dispatch(
      addParking({
        id: `p_${Date.now()}`,
        name: form.name,
        address: form.address,
        city: form.city,
        type: form.type,
        totalSlots: form.totalSlots,
        availableSlots: form.totalSlots,
        pricePerHour: form.pricePerHour,
        rating: 4.2,
        image:
          form.image ||
          "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80",
        openTime: form.openTime,
        closeTime: form.closeTime,
        providerId: user?.id || "",
        slots,
      })
    );

    toast({
      title: "Parking Added 🚀",
      description: `${form.name} is now live`,
    });

    navigate("/provider/my-parkings");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add Parking Space
        </h2>
        <p className="text-gray-500 mt-1">
          List your parking space and start earning
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md p-6 space-y-6"
      >

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Basic Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Parking Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Parking Details
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <Label>Total Slots</Label>
              <Input
                type="number"
                value={form.totalSlots}
                onChange={(e) =>
                  update("totalSlots", parseInt(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Price / Hour (₹)</Label>
              <Input
                type="number"
                value={form.pricePerHour}
                onChange={(e) =>
                  update("pricePerHour", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </div>

        {/* Timing */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Availability
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Opening Time</Label>
              <Input
                type="time"
                value={form.openTime}
                onChange={(e) => update("openTime", e.target.value)}
              />
            </div>

            <div>
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={form.closeTime}
                onChange={(e) => update("closeTime", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-3">
          <Label>Parking Image URL</Label>
          <Input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="Paste image URL..."
          />

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="h-40 w-full object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
          Add Parking Space
        </Button>

      </form>
    </motion.div>
  );
}