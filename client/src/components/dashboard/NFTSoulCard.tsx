import { useNftDetails } from "@/hooks/useNftDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import { useWeb3 } from "@/hooks/useWeb3";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";

export function NFTSoulCard() {
  const { address } = useWeb3();
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  const { nft, isLoading, error, refetch } = useNftDetails();

  const handleRetry = async () => {
    try {
      await refetch();
    } catch (err) {
      handleError(err, {
        context: 'NFT Data',
        fallbackMessage: 'Failed to refresh NFT data'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-5 aspect-square w-full rounded-lg" />
          <div className="mt-4 flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load NFT data';
    
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">NFT Soul ID</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
              Error
            </span>
          </div>
          <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-600 dark:text-red-400">
            <p className="text-sm font-medium mb-2">Failed to load NFT data</p>
            <p className="text-xs opacity-80">{errorMessage}</p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm" 
              onClick={handleRetry}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i> Retrying...
                </>
              ) : (
                <>
                  <i className="fas fa-redo mr-1"></i> Retry
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">NFT Soul ID</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
              Not Issued
            </span>
          </div>
          <div className="mt-5 aspect-square bg-slate-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <i className="fas fa-id-badge text-4xl text-slate-400 dark:text-slate-600 mb-4"></i>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              You don't have a Soul ID NFT yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
              Mint your unique FirstStepAI identity NFT to get started
            </p>
            <Button size="sm">
              <i className="fas fa-plus-circle mr-1"></i> Mint Soul ID
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { tokenId, metadata, network, mintedAt } = nft;
  const formattedDate = new Date(mintedAt).toLocaleDateString();
  
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">NFT Soul ID</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
            Active
          </span>
        </div>
        <div className="relative mt-5 aspect-square bg-gradient-to-br from-primary-700 to-blue-600 rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-repeat" style={{ 
              backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiBjeD0iMTAiIGN5PSIxMCIgcj0iMy41Ii8+PC9nPjwvc3ZnPg==')" 
            }}></div>
          </div>
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
            <div>
              <div className="text-sm font-mono opacity-80">#{tokenId}</div>
              <div className="mt-2 text-xl font-semibold font-mono">SOUL ID</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-80">Issued</div>
                <div className="text-sm">{formattedDate}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-80">Owner</div>
                <div className="text-sm font-mono">{truncateAddress(address || "")}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-80">Network</div>
                <div className="text-sm">{network}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button variant="link" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto font-normal">
            View Details
          </Button>
          <Button variant="link" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 p-0 h-auto font-normal">
            <i className="fas fa-share-alt mr-1"></i> Share
          </Button>
        </div>
      </div>
    </div>
  );
}
