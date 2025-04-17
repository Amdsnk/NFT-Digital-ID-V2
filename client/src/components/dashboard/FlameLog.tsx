import { useFlameLog } from "@/hooks/useFlameLog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function FlameLog() {
  const { flameLog, isLoading, error, pagination, setPagination } = useFlameLog();

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-7 w-64" />
        </div>
        <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="px-6 py-4 flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="mt-2 flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-slate-50 dark:bg-gray-950/50 px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-8 w-72" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Flame Log (Public Contributions)</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!flameLog || flameLog.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Flame Log (Public Contributions)</h2>
        <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-fire-alt text-slate-400 dark:text-slate-500 text-2xl"></i>
            </div>
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">No contributions yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Start participating in community activities to build your reputation and earn trust points.
            </p>
            <Button size="sm">
              View Opportunities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate pages array for pagination
  const pages = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    if (
      i === 1 ||
      i === pagination.totalPages ||
      (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === pagination.currentPage - 2 && pagination.currentPage > 3) ||
      (i === pagination.currentPage + 2 && pagination.currentPage < pagination.totalPages - 2)
    ) {
      pages.push("ellipsis");
    }
  }

  // Filter out consecutive ellipsis
  const filteredPages = pages.filter((page, index) => {
    if (page === "ellipsis" && pages[index - 1] === "ellipsis") {
      return false;
    }
    return true;
  });

  // Icon mapping for activity types
  const getActivityIcon = (category: string) => {
    const categoryIcons: Record<string, string> = {
      "Forum Contributions": "comment-dots",
      "Community Events": "users",
      "Content Creation": "file-alt",
      "Governance Participation": "vote-yea",
      "Project Submission": "tasks",
      "default": "star"
    };
    
    return categoryIcons[category] || categoryIcons.default;
  };

  // Color mapping for activity types
  const getActivityColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Forum Contributions": "bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400",
      "Community Events": "bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-400",
      "Content Creation": "bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400",
      "Governance Participation": "bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-400",
      "Project Submission": "bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-400",
      "default": "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
    };
    
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Flame Log (Public Contributions)</h2>
      <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
          {flameLog.map((activity) => (
            <li key={activity.id} className="px-6 py-4 flex items-start space-x-4">
              <div className="flex-shrink-0 pt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.category.name)}`}>
                  <i className={`fas fa-${getActivityIcon(activity.category.name)}`}></i>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {activity.title}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activity.description}
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <i className="far fa-clock mr-1"></i> {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    <i className="fas fa-fire mr-1"></i> +{activity.pointsEarned} points
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-slate-50 dark:bg-gray-950/50 px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              Showing <span className="font-medium">{pagination.startItem}</span> to{" "}
              <span className="font-medium">{pagination.endItem}</span> of{" "}
              <span className="font-medium">{pagination.totalItems}</span> activities
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                size="icon"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                onClick={handlePrevPage}
                disabled={pagination.currentPage <= 1}
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left text-xs"></i>
              </Button>
              
              {filteredPages.map((page, i) => 
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm font-medium text-slate-700 dark:text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant={pagination.currentPage === page ? "default" : "outline"}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      pagination.currentPage === page 
                        ? "z-10 bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400" 
                        : "bg-white dark:bg-gray-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
              
              <Button
                variant="outline"
                size="icon"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                onClick={handleNextPage}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
