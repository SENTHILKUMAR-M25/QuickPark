// import { mockUsers } from "../../utils/mockData";
// import { Button } from "../../components/ui/Button";
// import { Ban, Trash2 } from "lucide-react";
// import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";
// import { useToast } from "../../hooks/use-toast";

// export default function AdminUsers() {
//   const { toast } = useToast();
//   const users = mockUsers || [];

//   const getStatusStyle = (status) => {
//     return status === "active"
//       ? "bg-green-100 text-green-600"
//       : "bg-red-100 text-red-600";
//   };

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           User Management
//         </h2>
//         <p className="text-gray-500 mt-1">
//           Manage registered users and control access
//         </p>
//       </div>

//       {/* Table */}
//       <StaggerContainer>
//         <StaggerItem>
//           <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-md overflow-hidden">

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">

//                 {/* Head */}
//                 <thead>
//                   <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
//                     <th className="text-left py-3 px-4">Name</th>
//                     <th className="text-left py-3 px-4">Email</th>
//                     <th className="text-left py-3 px-4">Phone</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-right py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>

//                 {/* Body */}
//                 <tbody>
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="text-center py-8 text-gray-500">
//                         No users found
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user) => (
//                       <tr
//                         key={user.id}
//                         className="border-b border-gray-100 hover:bg-gray-50 transition"
//                       >
//                         <td className="py-3 px-4 font-medium text-gray-900">
//                           {user.name}
//                         </td>

//                         <td className="py-3 px-4 text-gray-600">
//                           {user.email}
//                         </td>

//                         <td className="py-3 px-4 text-gray-600">
//                           {user.phone}
//                         </td>

//                         <td className="py-3 px-4">
//                           <span
//                             className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusStyle(
//                               user.status
//                             )}`}
//                           >
//                             {user.status}
//                           </span>
//                         </td>

//                         <td className="py-3 px-4 text-right">
//                           <div className="flex items-center justify-end gap-2">

//                             {/* Block / Unblock */}
//                             <Button
//                               size="icon"
//                               className="bg-yellow-100 hover:bg-yellow-200 rounded-xl"
//                               onClick={() =>
//                                 toast({
//                                   title:
//                                     user.status === "active"
//                                       ? "User Blocked"
//                                       : "User Unblocked",
//                                   description: user.name,
//                                 })
//                               }
//                             >
//                               <Ban className="w-4 h-4 text-yellow-600" />
//                             </Button>

//                             {/* Delete */}
//                             <Button
//                               size="icon"
//                               className="bg-red-100 hover:bg-red-200 rounded-xl"
//                               onClick={() =>
//                                 toast({
//                                   title: "User Removed",
//                                   description: `${user.name} removed`,
//                                   variant: "destructive",
//                                 })
//                               }
//                             >
//                               <Trash2 className="w-4 h-4 text-red-600" />
//                             </Button>

//                           </div>
//                         </td>
//                       </tr>
//                     ))
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




import { mockUsers } from "../../utils/mockData";
import { Button } from "../../components/ui/Button";
import { Ban, Trash2, Search, UserCheck, ShieldOff, MoreHorizontal, Phone, Mail } from "lucide-react";
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";
import { useToast } from "../../hooks/use-toast";
import { Input } from "../../components/ui/Input";

export default function AdminUsers() {
  const { toast } = useToast();
  const users = mockUsers || [];

  const getStatusStyle = (status) => {
    return status === "active"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : "bg-slate-100 text-slate-500 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50/30 space-y-8 pb-12">
      
      {/* 🔷 Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Directory
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Audit system access and manage {users.length} registered accounts.
          </p>
        </div>
        <div className="flex gap-2">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Find by email or phone..." className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm" />
            </div>
        </div>
      </div>

      {/* 🔷 User Registry Table */}
      <StaggerContainer>
        <StaggerItem>
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-tighter border-b border-slate-100">
                    <th className="text-left py-5 px-8">Account Holder</th>
                    <th className="text-left py-5 px-8">Contact Information</th>
                    <th className="text-left py-5 px-8">Access Status</th>
                    <th className="text-right py-5 px-8">Security Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-slate-400 font-bold italic">
                        No user records available in the database.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-blue-50/30 transition-colors"
                      >
                        {/* Avatar & Name */}
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black ring-4 ring-indigo-50">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{user.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">UID: {user.id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td className="py-5 px-8">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-xs font-medium">{user.email}</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-600">
                                <Phone className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-xs font-medium">{user.phone}</span>
                             </div>
                          </div>
                        </td>

                        {/* Status Label */}
                        <td className="py-5 px-8">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(
                              user.status
                            )}`}
                          >
                            {user.status === "active" ? (
                                <UserCheck className="w-3 h-3 mr-1.5" />
                            ) : (
                                <ShieldOff className="w-3 h-3 mr-1.5" />
                            )}
                            {user.status}
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 hover:bg-amber-50 hover:text-amber-600 rounded-xl"
                              onClick={() => toast({ title: "Status Updated", description: `${user.name} access modified.` })}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 hover:bg-rose-50 hover:text-rose-600 rounded-xl"
                              onClick={() => toast({ title: "Account Purged", variant: "destructive", description: `${user.name} removed.` })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-slate-300">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
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