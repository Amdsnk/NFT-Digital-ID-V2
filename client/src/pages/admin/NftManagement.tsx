import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  CheckCircle,
  XCircle,
  Fingerprint,
  MoreVertical,
  ArrowUpDown,
  Shield,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { truncateAddress } from '@/lib/utils';

// NFT type definition
interface Nft {
  id: number;
  tokenId: string;
  userId: number;
  metadata: {
    name: string;
    image: string;
  };
  network: string;
  isActive: boolean;
  mintedAt: string;
  user?: {
    username: string;
    walletAddress: string;
    trustScore: number;
  };
}

// Transfer request type
interface TransferRequest {
  id: number;
  nftId: number;
  requesterId: number;
  newOwnerAddress: string;
  reason: string;
  status: string;
  createdAt: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  requester: {
    username: string;
    walletAddress: string;
  };
  nft: Nft;
}

// Mock NFT data
const mockNfts: Nft[] = [
  {
    id: 1,
    tokenId: "FSAI00123",
    userId: 1,
    metadata: {
      name: "Soul ID - Alex",
      image: "https://example.com/nft1.png"
    },
    network: "Ethereum",
    isActive: true,
    mintedAt: "2023-09-15T10:30:00Z",
    user: {
      username: "alex_web3",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      trustScore: 87
    }
  },
  {
    id: 2,
    tokenId: "FSAI00456",
    userId: 2,
    metadata: {
      name: "Soul ID - Sarah",
      image: "https://example.com/nft2.png"
    },
    network: "Polygon",
    isActive: true,
    mintedAt: "2023-10-05T14:20:00Z",
    user: {
      username: "crypto_sarah",
      walletAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",
      trustScore: 65
    }
  },
  {
    id: 3,
    tokenId: "FSAI00789",
    userId: 3,
    metadata: {
      name: "Soul ID - Dev",
      image: "https://example.com/nft3.png"
    },
    network: "Ethereum",
    isActive: true,
    mintedAt: "2023-08-22T09:15:00Z",
    user: {
      username: "blockchain_dev",
      walletAddress: "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB",
      trustScore: 92
    }
  },
  {
    id: 4,
    tokenId: "FSAI00234",
    userId: 4,
    metadata: {
      name: "Soul ID - Collector",
      image: "https://example.com/nft4.png"
    },
    network: "Polygon",
    isActive: true,
    mintedAt: "2023-11-10T16:45:00Z",
    user: {
      username: "nft_collector",
      walletAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      trustScore: 45
    }
  },
  {
    id: 5,
    tokenId: "FSAI00567",
    userId: 5,
    metadata: {
      name: "Soul ID - Guru",
      image: "https://example.com/nft5.png"
    },
    network: "Ethereum",
    isActive: true,
    mintedAt: "2023-09-30T11:20:00Z",
    user: {
      username: "defi_guru",
      walletAddress: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
      trustScore: 78
    }
  },
  {
    id: 6,
    tokenId: "FSAI00890",
    userId: 6,
    metadata: {
      name: "Soul ID - Newbie",
      image: "https://example.com/nft6.png"
    },
    network: "Polygon",
    isActive: false,
    mintedAt: "2024-01-05T08:30:00Z",
    user: {
      username: "web3_newbie",
      walletAddress: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
      trustScore: 12
    }
  },
  {
    id: 7,
    tokenId: "FSAI00345",
    userId: 7,
    metadata: {
      name: "Soul ID - Trader",
      image: "https://example.com/nft7.png"
    },
    network: "Ethereum",
    isActive: true,
    mintedAt: "2023-12-15T13:10:00Z",
    user: {
      username: "token_trader",
      walletAddress: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
      trustScore: 56
    }
  },
  {
    id: 8,
    tokenId: "FSAI00678",
    userId: 8,
    metadata: {
      name: "Soul ID - Voter",
      image: "https://example.com/nft8.png"
    },
    network: "Polygon",
    isActive: true,
    mintedAt: "2024-02-20T10:45:00Z",
    user: {
      username: "dao_voter",
      walletAddress: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
      trustScore: 34
    }
  }
];

// Mock transfer request data
const mockTransferRequests: TransferRequest[] = [
  {
    id: 1,
    nftId: 1,
    requesterId: 1,
    newOwnerAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    reason: "Moving to a new wallet for better security",
    status: "pending",
    createdAt: "2024-03-15T10:30:00Z",
    reviewedBy: null,
    reviewedAt: null,
    requester: {
      username: "alex_web3",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    nft: mockNfts[0]
  },
  {
    id: 2,
    nftId: 2,
    requesterId: 2,
    newOwnerAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",
    reason: "Gifting to a community member",
    status: "approved",
    createdAt: "2024-03-10T14:20:00Z",
    reviewedBy: 3,
    reviewedAt: "2024-03-12T09:15:00Z",
    requester: {
      username: "crypto_sarah",
      walletAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99"
    },
    nft: mockNfts[1]
  },
  {
    id: 3,
    nftId: 3,
    requesterId: 3,
    newOwnerAddress: "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB",
    reason: "Moving to hardware wallet",
    status: "pending",
    createdAt: "2024-03-18T09:15:00Z",
    reviewedBy: null,
    reviewedAt: null,
    requester: {
      username: "blockchain_dev",
      walletAddress: "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB"
    },
    nft: mockNfts[2]
  },
  {
    id: 4,
    nftId: 4,
    requesterId: 4,
    newOwnerAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    reason: "Consolidating wallets",
    status: "rejected",
    createdAt: "2024-03-05T16:45:00Z",
    reviewedBy: 1,
    reviewedAt: "2024-03-07T11:20:00Z",
    requester: {
      username: "nft_collector",
      walletAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    },
    nft: mockNfts[3]
  }
];

export default function AdminNftManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('nfts');
  
  // Fetch NFTs data with mock data as initialData
  const { data: nfts = [], isLoading: nftsLoading, error: nftsError } = useQuery<Nft[]>({
    queryKey: ['/api/admin/nfts'],
    retry: 1,
    initialData: mockNfts, // Use mock data to prevent errors
  });

  // Fetch transfer requests with mock data as initialData
  const { data: transferRequests = [], isLoading: requestsLoading, error: requestsError } = useQuery<TransferRequest[]>({
    queryKey: ['/api/admin/transfer-requests'],
    retry: 1,
    initialData: mockTransferRequests, // Use mock data to prevent errors
  });

  // Filter NFTs based on search term
  const filteredNfts = nfts.filter(
    (nft) =>
      nft.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nft.user?.username && nft.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (nft.user?.walletAddress && nft.user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter transfer requests based on search term
  const filteredRequests = transferRequests.filter(
    (request) =>
      request.nft.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.newOwnerAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and error states
  if ((activeTab === 'nfts' && nftsLoading) || (activeTab === 'requests' && requestsLoading)) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if ((activeTab === 'nfts' && nftsError) || (activeTab === 'requests' && requestsError)) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        <h3 className="font-semibold">Error Loading Data</h3>
        <p>There was an error loading the data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">NFT Management</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by token ID, user, or wallet address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Soul IDs"
          value={nfts.length}
          description="NFTs minted in the system"
          icon={<Fingerprint className="h-8 w-8 text-primary-500" />}
        />
        <StatCard
          title="Active Soul IDs"
          value={nfts.filter(nft => nft.isActive).length}
          description="Currently active NFTs"
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Pending Transfers"
          value={transferRequests.filter(req => req.status === 'pending').length}
          description="Awaiting approval"
          icon={<Shield className="h-8 w-8 text-amber-500" />}
        />
      </div>

      <Tabs defaultValue="nfts" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="nfts">Soul IDs</TabsTrigger>
          <TabsTrigger value="requests">Transfer Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nfts">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Soul ID NFTs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNfts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        No NFTs match your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNfts.map((nft) => (
                      <TableRow key={nft.id}>
                        <TableCell className="font-medium">{nft.tokenId}</TableCell>
                        <TableCell>{nft.user?.username || 'Unknown User'}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {nft.user?.walletAddress ? 
                            truncateAddress(nft.user.walletAddress) : 
                            'Unknown Wallet'}
                        </TableCell>
                        <TableCell>{nft.network}</TableCell>
                        <TableCell>
                          {nft.isActive ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Metadata</DropdownMenuItem>
                              {nft.isActive ? (
                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                  Deactivate NFT
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600 dark:text-green-400">
                                  Activate NFT
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Transfer Ownership</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>NFT Transfer Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Token ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>New Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        No transfer requests match your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">#{request.id}</TableCell>
                        <TableCell>{request.nft.tokenId}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{request.requester.username}</span>
                            <span className="text-xs text-slate-500 font-mono">
                              {truncateAddress(request.requester.walletAddress)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {truncateAddress(request.newOwnerAddress)}
                        </TableCell>
                        <TableCell>
                          {request.status === 'approved' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30">
                              Approved
                            </Badge>
                          ) : request.status === 'rejected' ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30">
                              Rejected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">Review</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transfer Request #{request.id}</DialogTitle>
                                <DialogDescription>
                                  Review the details of this transfer request
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="space-y-1 col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Token ID</p>
                                    <p className="font-medium">{request.nft.tokenId}</p>
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <p className="text-sm font-medium text-slate-500">Requested On</p>
                                    <p>{new Date(request.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-slate-500">Current Owner</p>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium">{request.requester.username}</p>
                                    <p className="text-xs text-slate-500 font-mono">
                                      ({truncateAddress(request.requester.walletAddress)})
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-slate-500">New Owner Address</p>
                                  <p className="font-mono">{request.newOwnerAddress}</p>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-slate-500">Reason for Transfer</p>
                                  <p className="text-sm">{request.reason}</p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between">
                                <Button variant="destructive">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject Transfer
                                </Button>
                                <Button>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Transfer
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: number; 
  description: string; 
  icon: React.ReactNode 
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg h-fit">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
