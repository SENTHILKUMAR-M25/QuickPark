// import StatCard from '../../components/StatCard';
// import BookingCard from '../../components/BookingCard';
// import { useAppSelector, useAppDispatch } from '../../redux/hook';
// import { cancelBooking } from '../../redux/slices/bookingSlice';
// import { LayoutDashboard, Calendar, CheckCircle, Heart, Plus, MapPin, ArrowUpRight, Zap } from 'lucide-react';
// import StaggerContainer, { StaggerItem } from '../../components/StaggerContainer';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '../../components/ui/Button';
// import { Link, Navigate } from 'react-router-dom';

// export default function UserDashboard() {
//   const { bookings } = useAppSelector((s) => s.booking);
//   const { user } = useAppSelector((s) => s.auth);
//   const dispatch = useAppDispatch();

//   const userBookings = bookings.filter((b) => b.userId === user?.id);
//   const active = userBookings.filter((b) => b.status === 'active');
//   const completed = userBookings.filter((b) => b.status === 'completed');

//   return (
//     <StaggerContainer className="max-w-7xl mx-auto space-y-12 px-6 md:px-10 py-10 min-h-screen">
      
//       {/* 🔷 Top Navigation/Breadcrumb - Subtle touch */}
//       <StaggerItem className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
//         <span>QuickPark</span>
//         <span className="w-1 h-1 rounded-full bg-border" />
//         <span className="text-primary font-bold">Dashboard</span>
//       </StaggerItem>

//       {/* 🔷 Hero Greeting Section */}
//       <StaggerItem className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div className="space-y-1">
//           <h2 className="text-5xl font-black tracking-tight leading-tight">
//             Howdy, <span className="text-primary italic">{user?.name?.split(' ')[0] || 'Driver'}</span>
//           </h2>
//           <div className="flex items-center gap-3">
//              <div className="flex -space-x-2">
//                 {[1, 2, 3].map(i => (
//                     <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
//                         {String.fromCharCode(64 + i)}
//                     </div>
//                 ))}
//              </div>
//              <p className="text-sm text-muted-foreground font-medium">
//                Shared parking community active in your area.
//              </p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-3">
//             <Link to="/explore" className="w-full md:w-auto">
//                 <Button size="lg" className="w-full rounded-2xl px-8 h-14 bg-primary hover:bg-primary/90 shadow-[0_10px_20px_-10px_rgba(58,134,255,0.4)] transition-all hover:-translate-y-1 group">
//                     <Zap className="w-4 h-4 mr-2 fill-current" />
//                     Find a Spot
//                     <ArrowUpRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
//                 </Button>
//             </Link>
//         </div>
//       </StaggerItem>

//       {/* 🔷 High-Impact Stats Grid */}
//       <StaggerItem>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Overview"
//             value={userBookings.length}
//             description="Total Sessions"
//             icon={LayoutDashboard}
//             glass
//             className="group hover:bg-white/5 transition-all"
//           />
//           <StatCard
//             title="In Progress"
//             value={active.length}
//             description="Active Sessions"
//             icon={Calendar}
//             glass
//             color="text-blue-400"
//             className="relative overflow-hidden"
//           />
//           <StatCard
//             title="Success"
//             value={completed.length}
//             description="Completed"
//             icon={CheckCircle}
//             glass
//             color="text-emerald-400"
//           />
//           <StatCard
//             title="Efficiency"
//             value="98%"
//             description="Positive Rating"
//             icon={Zap}
//             glass
//             color="text-amber-400"
//           />
//         </div>
//       </StaggerItem>

//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
//         {/* 🔷 Left Column: Live Bookings & History (8 Cols) */}
//         <StaggerItem className="xl:col-span-8 space-y-8">
//           <div className="flex items-center justify-between border-b border-border/40 pb-4">
//             <div className="flex items-center gap-4">
//                 <h3 className="font-display font-bold text-2xl">Activity Log</h3>
//                 <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Live</span>
//             </div>
//             <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
//                 Download CSV
//             </Button>
//           </div>

//           <div className="grid gap-6">
//             <AnimatePresence mode="popLayout">
//               {userBookings.length > 0 ? (
//                 userBookings.slice(0, 5).map((b) => (
//                   <motion.div
//                     key={b.id}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     whileHover={{ scale: 1.01 }}
//                     className="relative"
//                   >
//                     {/* Active Status Glow */}
//                     {b.status === 'active' && (
//                         <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(58,134,255,0.8)]" />
//                     )}
                    
//                     <BookingCard
//                       booking={b}
//                       showCancel={b.status === 'active'}
//                       onCancel={(id) => dispatch(cancelBooking(id))}
//                       glass
//                       className={`border border-white/5 ${b.status === 'active' ? 'bg-white/[0.03]' : ''}`}
//                     />
//                   </motion.div>
//                 ))
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="glass-card-strong relative group py-20 text-center rounded-[2.5rem] border-dashed border-2 border-white/5 hover:border-primary/20 transition-all cursor-pointer"
//                   onClick={() => Navigate('/explore')}
//                 >
//                   <div className="w-20 h-20 bg-gradient-to-tr from-primary/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
//                     <MapPin className="w-10 h-10 text-primary" />
//                   </div>
//                   <h4 className="text-2xl font-bold">Your dashboard is a bit quiet</h4>
//                   <p className="text-muted-foreground max-w-sm mx-auto mt-3">
//                     Once you start booking spots, you'll see real-time updates and parking analytics right here.
//                   </p>
//                   <Button variant="link" className="mt-6 text-primary font-bold">Explore local spots →</Button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </StaggerItem>

//         {/* 🔷 Right Column: Sidebar Actions (4 Cols) */}
//         <StaggerItem className="xl:col-span-4 space-y-8">
//             <div className="space-y-6">
//                 <h3 className="font-display font-bold text-2xl">Quick Insights</h3>
                
//                 {/* Savings/Utility Card */}
//                 <div className="glass-card-strong p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10">
//                     <div className="flex justify-between items-start mb-4">
//                         <div className="p-3 bg-emerald-500/20 rounded-2xl">
//                             <Zap className="w-5 h-5 text-emerald-400" />
//                         </div>
//                         <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Efficiency</span>
//                     </div>
//                     <h5 className="text-sm font-medium text-muted-foreground">Est. Time Saved</h5>
//                     <p className="text-3xl font-black mt-1">4.2 Hours</p>
//                     <p className="text-xs text-muted-foreground mt-2 italic">Calculated based on average search times in your city.</p>
//                 </div>

//                 {/* Favorites Placeholder with premium UI */}
//                 <div className="glass-card-strong p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
//                         <Heart className="w-12 h-12" />
//                     </div>
//                     <h5 className="font-bold mb-4">Favorite Locations</h5>
//                     <div className="space-y-4">
//                         {[1, 2].map(i => (
//                             <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
//                                 <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
//                                     <MapPin className="w-4 h-4 text-muted-foreground" />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs font-bold leading-none">Global Tech Center</p>
//                                     <p className="text-[10px] text-muted-foreground mt-1">Floor 4, Spot 22</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </StaggerItem>

//       </div>
//     </StaggerContainer>
//   );
// }



import StatCard from '../../components/StatCard';
import BookingCard from '../../components/BookingCard';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { cancelBooking } from '../../redux/slices/bookingSlice';
import { LayoutDashboard, Calendar, CheckCircle, Heart, Plus, MapPin, ArrowUpRight, Zap, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import StaggerContainer, { StaggerItem } from '../../components/StaggerContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { bookings } = useAppSelector((s) => s.booking);
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userBookings = bookings.filter((b) => b.userId === user?.id);
  const active = userBookings.filter((b) => b.status === 'active');
  const completed = userBookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-[#F8FAFC]"> {/* Soft Slate Background */}
      <StaggerContainer className="max-w-7xl mx-auto space-y-10 px-6 md:px-10 py-12">
        
      

        {/* 🔷 Hero Header */}
        <StaggerItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-2">
            <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">
              Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Member'}</span>
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> 
              You have {active.length} active sessions currently running.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/explore">
              <Button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white font-bold transition-all hover:-translate-y-1">
                <Plus className="w-5 h-5 mr-2" />
                Reserve New Spot
              </Button>
            </Link>
          </div>
        </StaggerItem>

        {/* 🔷 Strategic Stats Grid */}
        <StaggerItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Usage", val: userBookings.length, icon: LayoutDashboard, color: "text-slate-600", bg: "bg-slate-100" },
              { label: "Live Active", val: active.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Sessions Won", val: completed.length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Member Score", val: "9.8", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
              </div>
            ))}
          </div>
        </StaggerItem>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* 🔷 Main Activity Feed */}
          <StaggerItem className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-bold text-slate-900">Recent Activity</h3>
              <Button variant="ghost" className="text-xs font-bold text-blue-600">View Full History</Button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {userBookings.length > 0 ? (
                  userBookings.slice(0, 5).map((b) => (
                    <motion.div
                      key={b.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group"
                    >
                      <BookingCard
                        booking={b}
                        showCancel={b.status === 'active'}
                        onCancel={(id) => dispatch(cancelBooking(id))}
                        className={`bg-white border ${b.status === 'active' ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-200'} rounded-3xl p-6 shadow-sm hover:shadow-md transition-all`}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">No Reservations Yet</h4>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Start exploring your city and book your first premium parking spot today.</p>
                    <Button 
                      onClick={() => navigate('/explore')}
                      className="mt-6 bg-slate-900 text-white rounded-xl px-6"
                    >
                      Explore Maps
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </StaggerItem>

          {/* 🔷 Sidebar Analytics */}
          <StaggerItem className="xl:col-span-4 space-y-8">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Efficiency Metrics</h4>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-black text-slate-900">4.2h <span className="text-xs font-bold text-slate-400">/mo</span></p>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">Time Saved Searching</p>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[70%]" />
                  </div>
                  
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    "You are currently in the top 5% of efficient commuters in your region."
                  </p>
                </div>
              </div>
          </StaggerItem>

        </div>
      </StaggerContainer>
    </div>
  );
}