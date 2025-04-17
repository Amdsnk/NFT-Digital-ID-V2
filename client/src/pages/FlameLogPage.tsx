import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Flame, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Filter, 
  Calendar, 
  User,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useFlameLog, FlameLogEntry } from '@/hooks/useFlameLog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced FlameLog page with new features
export default function FlameLogPage() {
  const { address } = useWeb3();
  const { flameLog: flameLogEntries = [], addEntry: addFlameLogEntry } = useFlameLog();
  const { toast } = useToast();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('contribution');
  const [activeTab, setActiveTab] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  // New feature: Contribution categories
  const categories = [
    { id: 'contribution', name: 'Contribution', icon: <Flame className="h-4 w-4" /> },
    { id: 'update', name: 'Project Update', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'question', name: 'Question', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'event', name: 'Event', icon: <Calendar className="h-4 w-4" /> },
  ];

  // New feature: Contribution stats
  const contributionStats = {
    totalContributions: flameLogEntries?.length || 0,
    weeklyContributions: flameLogEntries?.filter(entry => {
      try {
        const entryDate = new Date(entry.timestamp);
        return !isNaN(entryDate.getTime()) && 
               entryDate.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
      } catch (e) {
        return false;
      }
    })?.length || 0,
    topCategory: 'Contribution',
    trustPointsEarned: 120,
  };

  // New feature: Filter entries by category
  const filteredEntries = activeTab === 'all' 
    ? flameLogEntries 
    : flameLogEntries?.filter(entry => entry.category === activeTab) || [];

  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty Post",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add new entry to flame log
      const newEntry: FlameLogEntry = {
        id: Date.now().toString(),
        author: {
          username: address ? `user_${address.substring(0, 6)}` : 'anonymous',
          walletAddress: address || '0x0000000000000000000000000000000000000000',
          trustLevel: 3,
        },
        content: newPostContent,
        category: newPostCategory,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        verified: false,
      };

      addFlameLogEntry(newEntry);

      toast({
        title: "Post Published!",
        description: "Your contribution has been added to the Flame Log.",
      });

      // Clear form
      setNewPostContent('');
      setShowNewPostDialog(false);
    } catch (error) {
      toast({
        title: "Post Failed",
        description: "There was an error publishing your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // New feature: Like a post
  const handleLikePost = (postId: string) => {
    // In a real app, this would call an API to like the post
    toast({
      title: "Post Liked",
      description: "You've liked this contribution.",
    });
  };

  // New feature: Verify a contribution
  const handleVerifyContribution = (postId: string) => {
    // In a real app, this would call an API to verify the contribution
    toast({
      title: "Contribution Verified",
      description: "This contribution has been verified.",
    });
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Invalid Date' 
        : date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Helper function to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Contribution';
  };

  // Helper function to get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <Flame className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Flame Log</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setShowNewPostDialog(true)}>
            <Flame className="mr-2 h-4 w-4" />
            New Contribution
          </Button>
        </div>
      </div>

      {/* New feature: Contribution stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Contributions" 
          value={contributionStats.totalContributions} 
          icon={<Flame className="h-5 w-5 text-primary-500" />} 
        />
        <StatCard 
          title="Weekly Activity" 
          value={contributionStats.weeklyContributions} 
          icon={<Calendar className="h-5 w-5 text-green-500" />} 
        />
        <StatCard 
          title="Top Category" 
          value={contributionStats.topCategory} 
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />} 
        />
        <StatCard 
          title="Trust Points" 
          value={contributionStats.trustPointsEarned} 
          icon={<ThumbsUp className="h-5 w-5 text-amber-500" />} 
        />
      </div>

      {/* New feature: Category tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              <div className="flex items-center">
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Flame className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No contributions yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                  Be the first to add a contribution to the Flame Log!
                </p>
                <Button onClick={() => setShowNewPostDialog(true)}>
                  <Flame className="mr-2 h-4 w-4" />
                  New Contribution
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map(entry => (
              <Card key={entry.id} className="mb-4">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${entry.author?.username || 'user'}`} />
                        <AvatarFallback>
                          {entry.author?.username ? entry.author.username.substring(0, 2).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {entry.author?.username || 'Anonymous User'}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(entry.timestamp)}</span>
                          <Badge variant="outline" className="mr-2">
                            <div className="flex items-center">
                              {getCategoryIcon(entry.category)}
                              <span className="ml-1">{getCategoryName(entry.category)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {entry.verified && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{entry.content}</p>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => handleLikePost(entry.id)}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {entry.likes || 0}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {entry.comments?.length || 0}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    {!entry.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyContribution(entry.id)}
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Contribution</DialogTitle>
            <DialogDescription>
              Share your contribution with the community. This will be added to your Flame Log.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newPostCategory} onValueChange={setNewPostCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="What would you like to share?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPost} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
