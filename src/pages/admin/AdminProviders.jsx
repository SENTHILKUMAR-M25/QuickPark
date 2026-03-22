// import { mockProviders } from "../../utils/mockData";
// import { Button } from "../../components/ui/Button";
// import { CheckCircle, XCircle } from "lucide-react";
// import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";
// import { useToast } from "../../hooks/use-toast";

// export default function AdminProviders() {
//   const { toast } = useToast();
//   const providers = mockProviders || [];

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-600";
//       case "pending":
//         return "bg-yellow-100 text-yellow-600";
//       case "rejected":
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
//           Provider Management
//         </h2>
//         <p className="text-gray-500 mt-1">
//           Approve or manage parking providers
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
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-right py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>

//                 {/* Body */}
//                 <tbody>
//                   {providers.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="text-center py-8 text-gray-500">
//                         No providers found
//                       </td>
//                     </tr>
//                   ) : (
//                     providers.map((provider) => (
//                       <tr
//                         key={provider.id}
//                         className="border-b border-gray-100 hover:bg-gray-50 transition"
//                       >
//                         <td className="py-3 px-4 font-medium text-gray-900">
//                           {provider.name}
//                         </td>

//                         <td className="py-3 px-4 text-gray-600">
//                           {provider.email}
//                         </td>

//                         <td className="py-3 px-4">
//                           <span
//                             className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusStyle(
//                               provider.status
//                             )}`}
//                           >
//                             {provider.status}
//                           </span>
//                         </td>

//                         <td className="py-3 px-4 text-right">
//                           {provider.status === "pending" && (
//                             <div className="flex items-center justify-end gap-2">

//                               <Button
//                                 size="icon"
//                                 className="bg-green-100 hover:bg-green-200 rounded-xl"
//                                 onClick={() =>
//                                   toast({
//                                     title: "Approved",
//                                     description: `${provider.name} approved`,
//                                   })
//                                 }
//                               >
//                                 <CheckCircle className="w-4 h-4 text-green-600" />
//                               </Button>

//                               <Button
//                                 size="icon"
//                                 className="bg-red-100 hover:bg-red-200 rounded-xl"
//                                 onClick={() =>
//                                   toast({
//                                     title: "Rejected",
//                                     description: `${provider.name} rejected`,
//                                   })
//                                 }
//                               >
//                                 <XCircle className="w-4 h-4 text-red-600" />
//                               </Button>

//                             </div>
//                           )}
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




import { mockProviders } from "../../utils/mockData";
import { Button } from "../../components/ui/Button";
import { CheckCircle, XCircle, Mail, UserCheck, ShieldAlert, Building, Search, Filter } from "lucide-react";
import StaggerContainer, { StaggerItem } from "../../components/StaggerContainer";
import { useToast } from "../../hooks/use-toast";
import { Input } from "../../components/ui/Input";

export default function AdminProviders() {
  const { toast } = useToast();
  const providers = mockProviders || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 space-y-8 pb-12">
      
      {/* 🔷 Professional Header & Partner Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Provider Management
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Authorize and manage institutional parking partners
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
           <div className="px-4 border-r border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</p>
              <p className="text-xl font-black text-blue-600">12</p>
           </div>
           <div className="px-4 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review</p>
              <p className="text-xl font-black text-amber-500">03</p>
           </div>
        </div>
      </div>

      {/* 🔷 Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search partners by name or email..." className="pl-10 h-12 bg-white rounded-xl border-slate-200" />
        </div>
        <Button variant="outline" className="rounded-xl border-slate-200 bg-white">
          <Filter className="w-4 h-4 mr-2" /> Advanced Filters
        </Button>
      </div>

      {/* 🔷 Partner Data Table */}
      <StaggerContainer>
        <StaggerItem>
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-tighter border-b border-slate-100">
                    <th className="text-left py-5 px-8">Company / Provider</th>
                    <th className="text-left py-5 px-8">Communication</th>
                    <th className="text-left py-5 px-8">Verification Status</th>
                    <th className="text-right py-5 px-8">Administrative Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {providers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20">
                         <Building className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold italic">No partners found in registry.</p>
                      </td>
                    </tr>
                  ) : (
                    providers.map((provider) => (
                      <tr
                        key={provider.id}
                        className="group hover:bg-blue-50/20 transition-colors"
                      >
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                               <Building className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 leading-none mb-1">{provider.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Partner ID: {provider.id.slice(0,8)}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-medium">{provider.email}</span>
                          </div>
                        </td>

                        <td className="py-6 px-8">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(
                              provider.status
                            )}`}
                          >
                            {provider.status === "active" && <UserCheck className="w-3 h-3 mr-1" />}
                            {provider.status === "pending" && <ShieldAlert className="w-3 h-3 mr-1" />}
                            {provider.status}
                          </span>
                        </td>

                        <td className="py-6 px-8 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {provider.status === "pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-bold shadow-lg shadow-blue-200"
                                  onClick={() => toast({ title: "Authorized", description: `${provider.name} is now a partner.` })}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold"
                                  onClick={() => toast({ title: "Rejected", variant: "destructive", description: "Applicant declined." })}
                                >
                                  Decline
                                </Button>
                              </>
                            ) : (
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600 font-bold">
                                    Manage Access
                                </Button>
                            )}
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