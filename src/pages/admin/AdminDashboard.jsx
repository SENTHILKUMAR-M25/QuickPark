// import StatCard from "../../components/StatCard";
// import { useAppSelector } from "../../redux/hook";
// import { Users, Car, Calendar, Building2 } from "lucide-react";
// import { mockUsers, mockProviders } from "../../utils/mockData";
// import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";

// export default function AdminDashboard() {
//   const { parkings = [] } = useAppSelector((state) => state.parking);
//   const { bookings = [] } = useAppSelector((state) => state.booking);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-600";
//       case "completed":
//         return "bg-blue-100 text-blue-600";
//       case "cancelled":
//         return "bg-red-100 text-red-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           Admin Dashboard
//         </h2>
//         <p className="text-gray-500 mt-1">
//           Overview of users, bookings, and parking activity
//         </p>
//       </div>

//       {/* Stats */}
//       <StaggerContainer>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard title="Total Users" value={mockUsers.length} icon={Users} />
//           <StatCard title="Providers" value={mockProviders.length} icon={Building2} />
//           <StatCard title="Parking Locations" value={parkings.length} icon={Car} />
//           <StatCard title="Bookings" value={bookings.length} icon={Calendar} />
//         </div>
//       </StaggerContainer>

//       {/* Recent Bookings */}
//       <StaggerContainer>
//         <StaggerItem>
//           <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-6 shadow-md">

//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Recent Bookings
//             </h3>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">

//                 {/* Table Head */}
//                 <thead>
//                   <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
//                     <th className="text-left py-3 px-4">ID</th>
//                     <th className="text-left py-3 px-4">Parking</th>
//                     <th className="text-left py-3 px-4">User</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-right py-3 px-4">Amount</th>
//                   </tr>
//                 </thead>

//                 {/* Table Body */}
//                 <tbody>
//                   {bookings.length > 0 ? (
//                     bookings.map((booking) => (
//                       <tr
//                         key={booking.id}
//                         className="border-b border-gray-100 hover:bg-gray-50 transition"
//                       >
//                         <td className="py-3 px-4 font-mono text-xs text-gray-500">
//                           {booking.id}
//                         </td>

//                         <td className="py-3 px-4 text-gray-800">
//                           {booking.parkingName}
//                         </td>

//                         <td className="py-3 px-4 text-gray-700">
//                           {booking.userName}
//                         </td>

//                         <td className="py-3 px-4">
//                           <span
//                             className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusStyle(
//                               booking.status
//                             )}`}
//                           >
//                             {booking.status}
//                           </span>
//                         </td>

//                         <td className="py-3 px-4 text-right font-semibold text-gray-900">
//                           ₹{booking.amount}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="text-center py-6 text-gray-500"
//                       >
//                         No bookings available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>

//               </table>
//             </div>

//           </div>
//         </StaggerItem>
//       </StaggerContainer>

//     </div>
//   );
// }


import StatCard from "../../components/StatCard"; // Assuming StatCard is updated or replaced below
import { useAppSelector } from "../../redux/hook";
import { Users, Car, Calendar, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { mockUsers, mockProviders } from "../../utils/mockData";
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";
import { Button } from "../../components/ui/Button";

export default function AdminDashboard() {
  const { parkings = [] } = useAppSelector((state) => state.parking);
  const { bookings = [] } = useAppSelector((state) => state.booking);

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 space-y-10 pb-12">
      
      {/* 🔷 Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Real-time analytics and management control
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex -space-x-2 px-2 border-r border-slate-100 mr-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">
                        OP
                    </div>
                ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase pr-2">Live Operators</span>
        </div>
      </div>

      {/* 🔷 High-Impact Insight Tiles */}
      <StaggerContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Users", val: mockUsers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Partner Providers", val: mockProviders.length, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active Facilities", val: parkings.length, icon: Car, color: "text-cyan-600", bg: "bg-cyan-50" },
            { label: "Global Bookings", val: bookings.length, icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
          ].map((stat, i) => (
            <StaggerItem key={i}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} p-3 rounded-2xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* 🔷 Activity Feed & Recent Data */}
      <StaggerContainer>
        <StaggerItem>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Booking Activity
                </h3>
                <p className="text-sm text-slate-400 font-medium">Monitoring latest platform transactions</p>
              </div>
              <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-tighter border-b border-slate-100">
                    <th className="text-left py-4 px-8">Transaction ID</th>
                    <th className="text-left py-4 px-8">Facility</th>
                    <th className="text-left py-4 px-8">User / Client</th>
                    <th className="text-left py-4 px-8">Operational Status</th>
                    <th className="text-right py-4 px-8">Revenue</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {bookings.length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <tr
                        key={booking.id}
                        className="group hover:bg-blue-50/20 transition-colors"
                      >
                        <td className="py-5 px-8 font-mono text-[11px] font-bold text-slate-400">
                          #{booking.id.slice(-6).toUpperCase()}
                        </td>

                        <td className="py-5 px-8">
                          <p className="text-sm font-bold text-slate-800">{booking.parkingName}</p>
                        </td>

                        <td className="py-5 px-8">
                          <p className="text-sm font-semibold text-slate-600">{booking.userName}</p>
                        </td>

                        <td className="py-5 px-8">
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${getStatusStyle(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="py-5 px-8 text-right font-black text-slate-900">
                          ₹{booking.amount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-20 text-slate-400 font-bold italic">
                        No recent activity recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

    </div>
  );
}