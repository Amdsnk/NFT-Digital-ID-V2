import { useTrustScore } from "@/hooks/useTrustScore";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function TrustScoreCard() {
  const { trustScore, isLoading, error } = useTrustScore();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="mt-5">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-full rounded-full mb-1" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
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
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Trust Score</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
              Error
            </span>
          </div>
          <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!trustScore) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Trust Score</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              Level 1
            </span>
          </div>
          <div className="mt-5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">points</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Start contributing to earn points
              </div>
            </div>
            <div className="relative pt-1">
              <Progress value={0} className="h-3" />
              <div className="flex mt-1 text-xs justify-between">
                <span className="text-slate-500 dark:text-slate-400">0</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Level 1 (0/200)</span>
                <span className="text-slate-500 dark:text-slate-400">200</span>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <i className="fas fa-info-circle mr-2"></i>
              Participate in community activities to earn trust points and level up your status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { score, level, weeklyChange } = trustScore;
  const nextLevelPoints = level * 200;
  const currentLevelPoints = (level - 1) * 200;
  const progressInCurrentLevel = score - currentLevelPoints;
  const progressPercentage = (progressInCurrentLevel / (nextLevelPoints - currentLevelPoints)) * 100;
  
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Trust Score</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
            Level {level}
          </span>
        </div>
        <div className="mt-5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{score}</span>
              <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">points</span>
            </div>
            {weeklyChange > 0 && (
              <div className="text-sm text-green-600 dark:text-green-400">
                <i className="fas fa-arrow-up mr-1"></i>
                +{weeklyChange} this week
              </div>
            )}
          </div>
          <div className="relative pt-1">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex mt-1 text-xs justify-between">
              <span className="text-slate-500 dark:text-slate-400">{currentLevelPoints}</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Level {level} ({score}/{nextLevelPoints})
              </span>
              <span className="text-slate-500 dark:text-slate-400">{nextLevelPoints}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {trustScore.contributionBreakdown.map((item) => (
            <div 
              key={item.category}
              className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-700"
            >
              <span className="text-sm text-slate-600 dark:text-slate-400">{item.category}</span>
              <span className="font-medium text-slate-900 dark:text-white">{item.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
