import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useBadges } from '@/hooks/useBadges';
import { 
  BarChart, 
  Activity, 
  Award, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Zap,
  Gift,
  Flame
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// New notification system component
function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'trust', message: 'Your trust score increased by 5 points', time: '2 hours ago', read: false },
    { id: 2, type: 'badge', message: 'You earned the "Early Adopter" badge', time: '1 day ago', read: false },
    { id: 3, type: 'dao', message: 'New proposal available for voting', time: '3 days ago', read: true },
    { id: 4, type: 'system', message: 'System maintenance scheduled for tomorrow', time: '4 days ago', read: true }
  ]);
  
  const { toast } = useToast();
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    
    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read."
    });
  };
  
  const clearAll = () => {
    setNotifications([]);
    
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared."
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border ${notification.read 
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                  : 'bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-full ${getNotificationIconBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'font-medium text-slate-900 dark:text-white'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function for notification icons
function getNotificationIcon(type: string) {
  switch (type) {
    case 'trust':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'badge':
      return <Award className="h-4 w-4 text-amber-500" />;
    case 'dao':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'system':
      return <Bell className="h-4 w-4 text-slate-500" />;
    default:
      return <Bell className="h-4 w-4 text-slate-500" />;
  }
}

// Helper function for notification icon backgrounds
function getNotificationIconBg(type: string) {
  switch (type) {
    case 'trust':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'badge':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'dao':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'system':
      return 'bg-slate-100 dark:bg-slate-800';
    default:
      return 'bg-slate-100 dark:bg-slate-800';
  }
}

// Bell icon component
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// New rewards system component
function RewardsSystem() {
  // Fixed destructuring to match the actual structure from useTrustScore hook
  const { trustScore } = useTrustScore();
  const score = trustScore.score;
  const level = trustScore.level;
  const weeklyChange = trustScore.weeklyChange;
  
  const { badges } = useBadges();
  const { toast } = useToast();
  
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState(2);
  const totalDailyTasks = 5;
  
  const dailyTasks = [
    { id: 1, name: 'Vote on a DAO proposal', completed: true, points: 5 },
    { id: 2, name: 'Contribute to community discussion', completed: true, points: 10 },
    { id: 3, name: 'Update your profile', completed: false, points: 3 },
    { id: 4, name: 'Verify your email', completed: false, points: 5 },
    { id: 5, name: 'Share a project update', completed: false, points: 15 }
  ];
  
  const completeTask = (id: number) => {
    // In a real app, this would call an API to mark the task as completed
    setDailyTasksCompleted(prev => prev + 1);
    
    toast({
      title: "Task Completed!",
      description: "You've earned points for completing this task.",
    });
  };
  
  const claimReward = () => {
    toast({
      title: "Reward Claimed!",
      description: "Your reward has been added to your account.",
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Daily Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Progress</span>
              <span className="font-medium">{dailyTasksCompleted}/{totalDailyTasks} Tasks</span>
            </div>
            <Progress value={(dailyTasksCompleted / totalDailyTasks) * 100} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-lg border ${task.completed 
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${task.completed 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      {task.completed 
                        ? <CheckIcon className="h-4 w-4 text-green-500" /> 
                        : <Clock className="h-4 w-4 text-slate-500" />}
                    </div>
                    <span className={task.completed ? 'line-through text-slate-500' : ''}>
                      {task.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/10">
                      +{task.points} pts
                    </Badge>
                    {!task.completed && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Gift className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-medium">Weekly Reward</h4>
                  <p className="text-sm text-slate-500">Complete daily tasks to claim</p>
                </div>
              </div>
              <Button 
                disabled={dailyTasksCompleted < totalDailyTasks}
                onClick={claimReward}
              >
                Claim
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Check icon component
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// New community leaderboard component
function CommunityLeaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');
  
  const leaderboardData = {
    weekly: [
      { rank: 1, username: 'crypto_sarah', points: 245, walletAddress: '0x9D7f...5E99', change: 'up' },
      { rank: 2, username: 'blockchain_dev', points: 230, walletAddress: '0x3A4e...5ecB', change: 'up' },
      { rank: 3, username: 'alex_web3', points: 215, walletAddress: '0x742d...f44e', change: 'down' },
      { rank: 4, username: 'defi_guru', points: 190, walletAddress: '0xAb84...5cb2', change: 'same' },
      { rank: 5, username: 'token_trader', points: 175, walletAddress: '0x787...abaB', change: 'up' },
    ],
    monthly: [
      { rank: 1, username: 'blockchain_dev', points: 890, walletAddress: '0x3A4e...5ecB', change: 'up' },
      { rank: 2, username: 'alex_web3', points: 845, walletAddress: '0x742d...f44e', change: 'same' },
      { rank: 3, username: 'crypto_sarah', points: 780, walletAddress: '0x9D7f...5E99', change: 'up' },
      { rank: 4, username: 'metaverse_builder', points: 720, walletAddress: '0x17F...c372', change: 'up' },
      { rank: 5, username: 'defi_guru', points: 695, walletAddress: '0xAb84...5cb2', change: 'down' },
    ],
    allTime: [
      { rank: 1, username: 'alex_web3', points: 3450, walletAddress: '0x742d...f44e', change: 'same' },
      { rank: 2, username: 'blockchain_dev', points: 3120, walletAddress: '0x3A4e...5ecB', change: 'up' },
      { rank: 3, username: 'crypto_sarah', points: 2980, walletAddress: '0x9D7f...5E99', change: 'same' },
      { rank: 4, username: 'defi_guru', points: 2540, walletAddress: '0xAb84...5cb2', change: 'same' },
      { rank: 5, username: 'metaverse_builder', points: 2350, walletAddress: '0x17F...c372', change: 'up' },
    ]
  };
  
  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Community Leaderboard</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="allTime" className="text-xs">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboardData[timeframe as keyof typeof leaderboardData].map((user) => (
            <div 
              key={user.rank} 
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  user.rank === 1 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                    : user.rank === 2 
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                      : user.rank === 3 
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-slate-500 font-mono">{user.walletAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-medium text-right">
                  {user.points} <span className="text-xs text-slate-500">pts</span>
                </div>
                <div className="w-6 flex justify-center">
                  {getChangeIcon(user.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Trending down icon component
function TrendingDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

// Minus icon component
function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

// Message square icon component
function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// Enhanced Dashboard with new features
export default function Dashboard() {
  const { address, isConnected } = useWeb3();
  // Fixed destructuring to match the actual structure from useTrustScore hook
  const { trustScore } = useTrustScore();
  // Define activityPoints with a default value
  const activityPoints = 25; // Default value or could be calculated from other data
  const { badges } = useBadges();
  const { toast } = useToast();
  const [showContributeDialog, setShowContributeDialog] = useState(false);
  const [contributionType, setContributionType] = useState("discussion");
  const [contributionContent, setContributionContent] = useState("");
  
  const handleContribute = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to contribute.",
        variant: "destructive",
      });
      return;
    }
    
    if (!contributionContent.trim()) {
      toast({
        title: "Empty Contribution",
        description: "Please add some content to your contribution.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to submit the contribution
    toast({
      title: "Contribution Submitted!",
      description: "Your contribution has been recorded and will be reviewed.",
    });
    
    setContributionContent("");
    setShowContributeDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Activity Log
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowContributeDialog(true)}
            disabled={!isConnected}
          >
            <Flame className="mr-2 h-4 w-4" />
            Contribute
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <svg className="w-32 h-32">
                  <circle
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary-500"
                    strokeWidth="6"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray="352"
                    strokeDashoffset={352 - (352 * trustScore.score) / 100}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-3xl font-bold">{trustScore.score}</span>
                  <span className="text-sm text-slate-500 block">/ 100</span>
                </div>
              </div>
              <div>
                <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border-0">
                  Level {trustScore.level}
                </Badge>
                <p className="text-sm text-slate-500 mt-2">
                  {trustScore.level < 3 
                    ? "Keep contributing to increase your trust level!" 
                    : trustScore.level < 5 
                      ? "You're doing great! Keep it up!" 
                      : "You're a top contributor!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-slate-500 mr-2" />
                  <span className="text-sm font-medium">Recent Activity</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  +{activityPoints} pts this week
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Zap className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm">Voted on DAO proposal #42</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm">Commented on community post</p>
                    <p className="text-xs text-slate-500">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm">Earned "Contributor" badge</p>
                    <p className="text-xs text-slate-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.earned 
                      ? badge.color || 'bg-primary-100 dark:bg-primary-900/30' 
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    <i className={`fas ${badge.icon} text-xl ${
                      badge.earned 
                        ? 'text-primary-500' 
                        : 'text-slate-400'
                    }`}></i>
                  </div>
                  <span className={`text-xs mt-2 ${
                    badge.earned 
                      ? 'font-medium' 
                      : 'text-slate-500'
                  }`}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" className="text-xs">
                View All Badges
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New features section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationCenter />
        <RewardsSystem />
      </div>
      
      <CommunityLeaderboard />
      
      {/* Contribute Dialog */}
      <Dialog open={showContributeDialog} onOpenChange={setShowContributeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make a Contribution</DialogTitle>
            <DialogDescription>
              Share your thoughts, ideas, or work with the community. Quality contributions increase your trust score.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contribution Type</label>
              <Select value={contributionType} onValueChange={setContributionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contribution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Community Discussion</SelectItem>
                  <SelectItem value="project">Project Update</SelectItem>
                  <SelectItem value="resource">Resource Sharing</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea 
                placeholder="Share your contribution here..."
                value={contributionContent}
                onChange={(e) => setContributionContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContributeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleContribute}>
              <Flame className="mr-2 h-4 w-4" />
              Submit Contribution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
