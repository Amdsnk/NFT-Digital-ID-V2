import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Save, 
  Award, 
  Database, 
  RotateCcw, 
  Network, 
  ShieldAlert,
  Shield,
  MoreVertical
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schemas
const networkSettingsSchema = z.object({
  networkType: z.string(),
  contractAddress: z.string().min(42, 'Contract address must be valid'),
  apiEndpoint: z.string().url('API endpoint must be a valid URL'),
  gasLimit: z.string().min(1, 'Gas limit is required'),
  adminWalletAddress: z.string().min(42, 'Admin wallet address must be valid'),
});

const trustSettingsSchema = z.object({
  minTrustScoreForVoting: z.number().min(0).max(100),
  maxTrustLevel: z.number().min(1).max(10),
  trustPointsDecayEnabled: z.boolean(),
  decayRatePerMonth: z.number().min(0).max(100),
  requireVerificationForDao: z.boolean(),
});

const badgeSettingsSchema = z.object({
  name: z.string().min(3, 'Badge name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pointValue: z.number().min(1, 'Point value must be at least 1'),
  badgeType: z.string().min(1, 'Badge type is required'),
});

export default function AdminSystemSettings() {
  const [activeTab, setActiveTab] = useState('network');

  // Network Settings form
  const networkForm = useForm<z.infer<typeof networkSettingsSchema>>({
    resolver: zodResolver(networkSettingsSchema),
    defaultValues: {
      networkType: 'Polygon',
      contractAddress: '0x1234567890123456789012345678901234567890',
      apiEndpoint: 'https://api.firststepai.com/v1',
      gasLimit: '300000',
      adminWalletAddress: '0x9876543210987654321098765432109876543210',
    },
  });

  // Trust Settings form
  const trustForm = useForm<z.infer<typeof trustSettingsSchema>>({
    resolver: zodResolver(trustSettingsSchema),
    defaultValues: {
      minTrustScoreForVoting: 25,
      maxTrustLevel: 5,
      trustPointsDecayEnabled: true,
      decayRatePerMonth: 5,
      requireVerificationForDao: true,
    },
  });

  // Badge Creation form
  const badgeForm = useForm<z.infer<typeof badgeSettingsSchema>>({
    resolver: zodResolver(badgeSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
      pointValue: 10,
      badgeType: 'achievement',
    },
  });

  // Form submission handlers
  const onNetworkSubmit = (data: z.infer<typeof networkSettingsSchema>) => {
    console.log('Network settings submitted:', data);
    // Here you would make an API call to save the settings
  };

  const onTrustSubmit = (data: z.infer<typeof trustSettingsSchema>) => {
    console.log('Trust settings submitted:', data);
    // Here you would make an API call to save the settings
  };

  const onBadgeSubmit = (data: z.infer<typeof badgeSettingsSchema>) => {
    console.log('Badge created:', data);
    // Here you would make an API call to create a new badge
    badgeForm.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="network" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="network">
            <Network className="mr-2 h-4 w-4" />
            Blockchain Network
          </TabsTrigger>
          <TabsTrigger value="trust">
            <Shield className="mr-2 h-4 w-4" />
            Trust System
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="mr-2 h-4 w-4" />
            Badge Management
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Database Controls
          </TabsTrigger>
        </TabsList>
        
        {/* Network Settings */}
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Network Configuration</CardTitle>
              <CardDescription>
                Configure the blockchain network settings for the Soul ID NFTs
              </CardDescription>
            </CardHeader>
            <Form {...networkForm}>
              <form onSubmit={networkForm.handleSubmit(onNetworkSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={networkForm.control}
                    name="networkType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The blockchain network used for minting NFTs (e.g., Ethereum, Polygon)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={networkForm.control}
                    name="contractAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The deployed contract address for Soul ID NFTs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={networkForm.control}
                    name="apiEndpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Endpoint</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The blockchain API endpoint URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={networkForm.control}
                      name="gasLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gas Limit</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Default gas limit for transactions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={networkForm.control}
                      name="adminWalletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Wallet Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The admin wallet address with contract ownership
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Network Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        {/* Trust System Settings */}
        <TabsContent value="trust">
          <Card>
            <CardHeader>
              <CardTitle>Trust System Configuration</CardTitle>
              <CardDescription>
                Configure the parameters for the trust scoring and leveling system
              </CardDescription>
            </CardHeader>
            <Form {...trustForm}>
              <form onSubmit={trustForm.handleSubmit(onTrustSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={trustForm.control}
                    name="minTrustScoreForVoting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Trust Score for Voting: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={100}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          The minimum trust score required to participate in DAO voting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={trustForm.control}
                    name="maxTrustLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Trust Level: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={10}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          The maximum trust level users can achieve
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={trustForm.control}
                    name="trustPointsDecayEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Trust Points Decay</FormLabel>
                          <FormDescription>
                            Enable trust score decay for inactive users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {trustForm.watch('trustPointsDecayEnabled') && (
                    <FormField
                      control={trustForm.control}
                      name="decayRatePerMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Decay Rate: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider
                              defaultValue={[field.value]}
                              max={100}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormDescription>
                            The percentage of trust points to decay each month of inactivity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={trustForm.control}
                    name="requireVerificationForDao"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Verification for DAO</FormLabel>
                          <FormDescription>
                            Require identity verification for DAO participation
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Trust Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        {/* Badge Management */}
        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Badge</CardTitle>
                <CardDescription>
                  Create a new badge that can be earned by users
                </CardDescription>
              </CardHeader>
              <Form {...badgeForm}>
                <form onSubmit={badgeForm.handleSubmit(onBadgeSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={badgeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Early Contributor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={badgeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Awarded to users who contributed during the first month of the platform" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={badgeForm.control}
                        name="pointValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Point Value</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Trust points earned when badge is awarded
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={badgeForm.control}
                        name="badgeType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge Type</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="achievement" />
                            </FormControl>
                            <FormDescription>
                              Category of the badge (e.g., achievement, participation)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Award className="mr-2 h-4 w-4" />
                      Create Badge
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Badges</CardTitle>
                  <CardDescription>
                    Manage and edit the existing badges in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: 'Early Adopter', type: 'achievement', pointValue: 50 },
                      { id: 2, name: 'Forum Contributor', type: 'participation', pointValue: 25 },
                      { id: 3, name: 'Governance', type: 'achievement', pointValue: 75 },
                      { id: 4, name: 'NFT Creator', type: 'contribution', pointValue: 40 },
                    ].map((badge) => (
                      <div key={badge.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
                            <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{badge.name}</h4>
                            <p className="text-sm text-slate-500">Type: {badge.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold">
                            {badge.pointValue} pts
                          </span>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Database Controls */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Advanced database operations and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Caution</h3>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  These operations affect the database directly. Use with caution as they cannot be undone.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Data Backup</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Create a full backup of the database
                  </p>
                  <Button variant="outline">
                    Download Database Backup
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Reset System</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Reset the system to its initial state (all data will be lost)
                  </p>
                  <Button variant="destructive">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset System
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Database Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Users</p>
                    <p className="font-semibold">123</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">NFTs</p>
                    <p className="font-semibold">89</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Proposals</p>
                    <p className="font-semibold">42</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Badges</p>
                    <p className="font-semibold">15</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}