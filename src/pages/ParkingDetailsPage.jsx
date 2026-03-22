import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { addBooking } from "../redux/slices/bookingSlice";
import { updateSlotStatus } from "../redux/slices/parkingSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { MapPin, Clock, Star, Car, ArrowLeft, Info, Calendar as CalIcon, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useToast } from "../hooks/use-toast";

export default function ParkingDetailsPage() {
  const { id } = useParams();
  const { parkings } = useAppSelector((s) => s.parking);
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const parking = parkings.find((p) => p.id === id);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "10:00",
    endTime: "12:00",
    vehicleNumber: "",
  });

  const total = useMemo(() => {
    const start = bookingForm.startTime.split(":").map(Number);
    const end = bookingForm.endTime.split(":").map(Number);
    const duration = Math.max(0, (end[0] + end[1] / 60) - (start[0] + start[1] / 60));
    return {
      hours: duration.toFixed(1),
      amount: Math.round(duration * (parking?.pricePerHour || 0))
    };
  }, [bookingForm.startTime, bookingForm.endTime, parking?.pricePerHour]);

  if (!parking) return <div className="p-20 text-center font-display text-slate-600">Location not found.</div>;

  const handleBook = () => {
    if (!selectedSlot) return toast({ title: "Please select a slot", variant: "destructive" });
    if (!bookingForm.vehicleNumber) return toast({ title: "Vehicle number required", variant: "destructive" });

    dispatch(addBooking({
      id: `b_${Date.now()}`,
      parkingId: parking.id,
      parkingName: parking.name,
      slotLabel: selectedSlot,
      userId: user?.id || "guest",
      userName: user?.name || "Guest",
      ...bookingForm,
      amount: total.amount,
      status: "active",
    }));

    dispatch(updateSlotStatus({ parkingId: parking.id, slotId: selectedSlot, status: "booked" }));
    toast({ title: "Success", description: "Your spot is reserved." });
    navigate("/user/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 🔷 Professional Header Section */}
      <div className="bg-white border-b border-slate-200 pt-6 pb-24">
        <div className="container mx-auto px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                  Verified Facility
                </span>
                <span className="text-slate-300">|</span>
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {parking.city}
                </p>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {parking.name}
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <div className="px-4 border-r border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Rating</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {parking.rating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </p>
               </div>
               <div className="px-4 text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hourly Rate</p>
                  <p className="text-lg font-black text-blue-600">₹{parking.pricePerHour}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* 🔷 Left Side: Media & Slots */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl border-4 border-white shadow-blue-900/10"
            >
              <img src={parking.image} className="w-full h-full object-cover" alt="Parking" />
            </motion.div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, text: "Secure Access", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Zap, text: "Instant Booking", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Clock, text: "24/7 Service", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: Car, text: "Valet Entry", color: "text-slate-600", bg: "bg-slate-100" }
              ].map((f, i) => (
                <div key={i} className={`${f.bg} p-4 rounded-2xl flex items-center gap-3 border border-white`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                  <span className="text-sm font-bold text-slate-700">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Slot Picker */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Available Spaces
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-sm font-medium text-slate-400">Total {parking.slots.length} Slots</span>
              </h2>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {parking.slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`h-14 rounded-xl font-bold text-sm transition-all border-2 flex flex-col items-center justify-center ${
                      selectedSlot === slot.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-white border-slate-100 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-[10px] opacity-60 uppercase tracking-tighter leading-none">{slot.label[0]}</span>
                    {slot.label.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🔷 Right Side: The Booking Card */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-200 sticky top-10"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Reservation Details</h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Date</Label>
                  <div className="relative">
                    <CalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <Input type="date" value={bookingForm.date} className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Check In</Label>
                    <Input type="time" value={bookingForm.startTime} className="h-14 bg-slate-50 border-none rounded-2xl" onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Check Out</Label>
                    <Input type="time" value={bookingForm.endTime} className="h-14 bg-slate-50 border-none rounded-2xl" onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Reg. Number</Label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <Input placeholder="Enter Number" className="pl-12 h-14 bg-slate-50 border-none rounded-2xl" value={bookingForm.vehicleNumber} onChange={(e) => setBookingForm({...bookingForm, vehicleNumber: e.target.value.toUpperCase()})} />
                  </div>
                </div>

                {/* Final Checkout Info */}
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Service Duration</span>
                      <span className="text-slate-900">{total.hours} Hours</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Assigned Spot</span>
                      <span className="text-blue-600 font-black">{selectedSlot || "Required"}</span>
                   </div>
                   <div className="h-px bg-blue-100 my-2" />
                   <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-bold">Final Amount</span>
                      <span className="text-3xl font-black text-blue-600 tracking-tighter">₹{total.amount}</span>
                   </div>
                </div>

                <Button 
                  onClick={handleBook}
                  disabled={!selectedSlot}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  Confirm Reservation
                </Button>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <Info className="w-3 h-3" /> Secure checkout powered by QuickPark
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}