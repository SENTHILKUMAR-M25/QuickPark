// import { useAppSelector } from "../../redux/hook";
// import BookingCard from "../../components/BookingCard";
// import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";

// export default function AdminBookings() {
//   const bookings = useAppSelector((state) => state.booking.bookings);

//   // Stats
//   const total = bookings?.length || 0;
//   const active = bookings?.filter(b => b.status === "active").length || 0;
//   const completed = bookings?.filter(b => b.status === "completed").length || 0;

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           All Bookings
//         </h2>
//         <p className="text-gray-500 mt-1">
//           Manage and monitor all parking bookings
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//         <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow">
//           <p className="text-sm text-gray-500">Total Bookings</p>
//           <p className="text-xl font-semibold text-gray-900">{total}</p>
//         </div>

//         <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow">
//           <p className="text-sm text-gray-500">Active</p>
//           <p className="text-xl font-semibold text-green-600">{active}</p>
//         </div>

//         <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow">
//           <p className="text-sm text-gray-500">Completed</p>
//           <p className="text-xl font-semibold text-blue-600">{completed}</p>
//         </div>

//       </div>

//       {/* Booking List */}
//       <StaggerContainer className="space-y-4">

//         {bookings && bookings.length > 0 ? (
//           bookings.map((b) => (
//             <StaggerItem key={b.id}>
//               <BookingCard booking={b} />
//             </StaggerItem>
//           ))
//         ) : (
//           <StaggerItem>
//             <div className="text-center py-12 bg-white/60 backdrop-blur-lg border border-white/30 rounded-xl">
//               <p className="text-gray-500 text-sm">
//                 No bookings available
//               </p>
//             </div>
//           </StaggerItem>
//         )}

//       </StaggerContainer>

//     </div>
//   );
// }



import { useAppSelector } from "../../redux/hook";
import { StaggerItem } from "../../components/StaggerContainer";
import { motion } from "framer-motion";
import { 
  Search, 
  Download, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useState } from "react";

export default function AdminBookings() {
  const bookings = useAppSelector((state) => state.booking.bookings);
  const [filter, setFilter] = useState("all");

  // Stats Logic
  const stats = {
    total: bookings?.length || 0,
    active: bookings?.filter(b => b.status === "active").length || 0,
    completed: bookings?.filter(b => b.status === "completed").length || 0,
  };

  const filteredBookings = bookings?.filter(b => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-8 pb-12">
      
      {/* 🔷 Admin Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Booking Management
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Reviewing {stats.total} total reservations across all facilities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* 🔷 High-Density Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Volume", val: stats.total, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Live Sessions", val: stats.active, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Finalized", val: stats.completed, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 🔷 Data Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {["all", "active", "completed"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search user or vehicle..." className="pl-10 bg-white border-slate-200 rounded-xl h-10 text-sm" />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Facility & Slot</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Timeframe</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={b.id} 
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                          {b.userName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{b.userName}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{b.vehicleNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{b.parkingName}</p>
                      <p className="text-xs text-blue-600 font-bold">Spot: {b.slotLabel}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{b.date}</p>
                      <p className="text-xs text-slate-400">{b.startTime} - {b.endTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">₹{b.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        b.status === "active" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                         </button>
                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-sm font-bold text-slate-400">No records match your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}