import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  BadgeCheck, 
  Vote, 
  Flame, 
  ShieldAlert, 
  ArrowUpRight 
} from "lucide-react";

export function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    staleTime: 60 * 1000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="ml-5 w-full">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Mock data for development
  const mockStats = {
    totalUsers: 156,
    activeNfts: 142,
    pendingApprovals: 8,
    totalVotes: 32,
    flameLogEntries: 287,
    averageTrustScore: 78.5,
  };

  const data = stats || mockStats;

  const statCards = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Active NFTs",
      value: data.activeNfts,
      icon: BadgeCheck,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Pending Approvals",
      value: data.pendingApprovals,
      icon: ShieldAlert,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      change: "-2",
      changeType: "decrease",
    },
    {
      title: "DAO Votes",
      value: data.totalVotes,
      icon: Vote,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      change: "+5",
      changeType: "increase",
    },
    {
      title: "Flame Log Entries",
      value: data.flameLogEntries,
      icon: Flame,
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      change: "+24",
      changeType: "increase",
    },
    {
      title: "Avg. Trust Score",
      value: data.averageTrustScore,
      suffix: "/100",
      icon: BadgeCheck,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      change: "+2.3",
      changeType: "increase",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {stat.value}{stat.suffix || ""}
                  </p>
                  <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === "increase" 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {stat.change}
                    <ArrowUpRight className={`self-center h-4 w-4 ${
                      stat.changeType === "decrease" ? "rotate-180" : ""
                    }`} />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
