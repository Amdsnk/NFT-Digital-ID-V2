import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
  category: string;
  earnedAt?: Date;
};

type BadgeProgress = {
  name: string;
  currentPoints: number;
  requiredPoints: number;
  percentage: number;
};

export function BadgesCard() {
  const [showAllBadges, setShowAllBadges] = useState(false);

  const { data: badges, isLoading, error } = useQuery({
    queryKey: ["/api/users/1/badges"],
    staleTime: 60 * 1000,
  });

  const { data: badgeProgress } = useQuery({
    queryKey: ["/api/users/1/badge-progress"],
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
            <Skeleton className="h-5 w-48 mb-3" />
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Badges & Achievements</h2>
          </div>
          <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-600 dark:text-red-400">
            Failed to load badges. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Sample data if real data is not available
  const earnedBadges: Badge[] = badges || [
    { id: 1, name: "Early Adopter", description: "One of the first users to join", icon: "seedling", requiredPoints: 50, category: "general", earnedAt: new Date() },
    { id: 2, name: "Top Contributor", description: "Consistently contributes to the community", icon: "comments", requiredPoints: 300, category: "contribution", earnedAt: new Date() },
    { id: 3, name: "Governance", description: "Active participant in governance decisions", icon: "vote-yea", requiredPoints: 75, category: "governance", earnedAt: new Date() },
    { id: 4, name: "Innovator", description: "Created innovative solutions with FirstStepAI", icon: "lightbulb", requiredPoints: 200, category: "technical", earnedAt: new Date() },
    { id: 5, name: "Flame 100", description: "Earned 100+ points in a single week", icon: "fire", requiredPoints: 100, category: "achievement", earnedAt: new Date() },
  ];

  const progressBadges: BadgeProgress[] = badgeProgress || [
    { name: "Community Builder", currentPoints: 36, requiredPoints: 50, percentage: 72 },
    { name: "Tech Visionary", currentPoints: 18, requiredPoints: 50, percentage: 36 },
  ];

  const displayBadges = showAllBadges ? earnedBadges : earnedBadges.slice(0, 6);
  const hasMoreBadges = earnedBadges.length > 6;

  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Badges & Achievements</h2>
          {hasMoreBadges && (
            <Button 
              variant="link" 
              className="text-sm text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto font-normal"
              onClick={() => setShowAllBadges(!showAllBadges)}
            >
              {showAllBadges ? "Show Less" : "View All"}
            </Button>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          {displayBadges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${getBadgeColorClass(badge.category)}`}
              >
                <i className={`fas fa-${badge.icon}`}></i>
              </div>
              <span className="mt-2 text-xs text-slate-600 dark:text-slate-400 text-center">{badge.name}</span>
            </div>
          ))}
          
          {/* Display locked badge placeholder if less than 6 badges earned */}
          {earnedBadges.length < 6 && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-600">
                <i className="fas fa-plus text-sm"></i>
              </div>
              <span className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">Locked</span>
            </div>
          )}
        </div>
        
        {progressBadges.length > 0 && (
          <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-300 mb-3">Progress toward next badge</h3>
            <div className="space-y-3">
              {progressBadges.map((badge) => (
                <div key={badge.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">
                      {badge.name} ({badge.currentPoints}/{badge.requiredPoints})
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{badge.percentage}%</span>
                  </div>
                  <Progress value={badge.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getBadgeColorClass(category: string): string {
  switch (category) {
    case "general":
      return "bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400";
    case "contribution":
      return "bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400";
    case "governance":
      return "bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-400";
    case "technical":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-400";
    case "achievement":
      return "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
  }
}
