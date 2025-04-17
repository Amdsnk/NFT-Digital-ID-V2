import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWeb3 } from "@/hooks/useWeb3";

interface OpportunityCard {
  title: string;
  description: string;
  points: number;
  category: string;
  progress?: number;
  maxProgress?: number;
  icon: string;
}

export function ContributionOpportunities() {
  const { isConnected } = useWeb3();

  const opportunities: OpportunityCard[] = [
    {
      title: "Daily Forum Activity",
      description: "Participate in discussions and help other community members",
      points: 15,
      category: "Forum Contributions",
      progress: 2,
      maxProgress: 5,
      icon: "comment-dots"
    },
    {
      title: "Content Creation Challenge",
      description: "Create a tutorial or guide about FirstStepAI features",
      points: 50,
      category: "Content Creation",
      icon: "file-alt"
    },
    {
      title: "Upcoming Community Event",
      description: "Join the weekly AI & Web3 integration workshop",
      points: 25,
      category: "Community Events",
      icon: "users"
    },
    {
      title: "Active Proposal Voting",
      description: "Cast your vote on the latest governance proposals",
      points: 10,
      category: "Governance Participation",
      progress: 1,
      maxProgress: 3,
      icon: "vote-yea"
    }
  ];

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Forum Contributions": "text-green-600 dark:text-green-400",
      "Content Creation": "text-blue-600 dark:text-blue-400",
      "Community Events": "text-yellow-600 dark:text-yellow-400",
      "Governance Participation": "text-purple-600 dark:text-purple-400",
      "Project Submission": "text-indigo-600 dark:text-indigo-400"
    };
    return categoryColors[category] || "text-slate-600 dark:text-slate-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earn Trust Points</CardTitle>
        <CardDescription>
          Complete these activities to increase your trust score and unlock new privileges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <i className={`fas fa-${opportunity.icon} ${getCategoryColor(opportunity.category)}`}></i>
                    <h3 className="font-medium text-slate-900 dark:text-white">{opportunity.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {opportunity.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`font-medium ${getCategoryColor(opportunity.category)}`}>
                      +{opportunity.points} points
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {opportunity.category}
                    </span>
                  </div>
                  {opportunity.progress !== undefined && opportunity.maxProgress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{opportunity.progress}/{opportunity.maxProgress}</span>
                      </div>
                      <Progress
                        value={(opportunity.progress / opportunity.maxProgress) * 100}
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 whitespace-nowrap"
                  disabled={!isConnected}
                >
                  Start Task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}