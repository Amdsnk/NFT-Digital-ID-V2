import React, { useState } from 'react';
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
  UserCheck,
  UserX,
  Award,
  Shield,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// User type definition
interface User {
  id: number;
  username: string;
  email: string | null;
  walletAddress: string;
  trustScore: number;
  trustLevel: number;
  isAdmin: boolean;
  createdAt: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    username: "alex_web3",
    email: "alex@example.com",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    trustScore: 87,
    trustLevel: 4,
    isAdmin: true,
    createdAt: "2023-09-15T10:30:00Z"
  },
  {
    id: 2,
    username: "crypto_sarah",
    email: "sarah@example.com",
    walletAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",
    trustScore: 65,
    trustLevel: 3,
    isAdmin: false,
    createdAt: "2023-10-05T14:20:00Z"
  },
  {
    id: 3,
    username: "blockchain_dev",
    email: "dev@example.com",
    walletAddress: "0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB",
    trustScore: 92,
    trustLevel: 5,
    isAdmin: true,
    createdAt: "2023-08-22T09:15:00Z"
  },
  {
    id: 4,
    username: "nft_collector",
    email: "collector@example.com",
    walletAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    trustScore: 45,
    trustLevel: 2,
    isAdmin: false,
    createdAt: "2023-11-10T16:45:00Z"
  },
  {
    id: 5,
    username: "defi_guru",
    email: "guru@example.com",
    walletAddress: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    trustScore: 78,
    trustLevel: 4,
    isAdmin: false,
    createdAt: "2023-09-30T11:20:00Z"
  },
  {
    id: 6,
    username: "web3_newbie",
    email: null,
    walletAddress: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    trustScore: 12,
    trustLevel: 1,
    isAdmin: false,
    createdAt: "2024-01-05T08:30:00Z"
  },
  {
    id: 7,
    username: "token_trader",
    email: "trader@example.com",
    walletAddress: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
    trustScore: 56,
    trustLevel: 3,
    isAdmin: false,
    createdAt: "2023-12-15T13:10:00Z"
  },
  {
    id: 8,
    username: "dao_voter",
    email: "voter@example.com",
    walletAddress: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
    trustScore: 34,
    trustLevel: 2,
    isAdmin: false,
    createdAt: "2024-02-20T10:45:00Z"
  },
  {
    id: 9,
    username: "metaverse_builder",
    email: "builder@example.com",
    walletAddress: "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
    trustScore: 81,
    trustLevel: 4,
    isAdmin: false,
    createdAt: "2023-10-12T15:30:00Z"
  },
  {
    id: 10,
    username: "crypto_researcher",
    email: "research@example.com",
    walletAddress: "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",
    trustScore: 73,
    trustLevel: 3,
    isAdmin: false,
    createdAt: "2023-11-25T09:50:00Z"
  }
];

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch users data with mock data as initialData
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    retry: 1,
    initialData: mockUsers, // Use mock data to prevent errors
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        <h3 className="font-semibold">Error Loading Users</h3>
        <p>There was an error loading the user data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users by name, email, or wallet address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={users.length}
          description="Registered in the system"
          icon={<UserCheck className="h-8 w-8 text-blue-500" />}
        />
        <StatCard
          title="Verified Users"
          value={users.filter((u: User) => u.trustScore > 0).length}
          description="With trust score > 0"
          icon={<Shield className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Admins"
          value={users.filter((u: User) => u.isAdmin).length}
          description="With administrative rights"
          icon={<Award className="h-8 w-8 text-amber-500" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                    No users match your search criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-sm text-slate-500">{user.email || 'No email'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {`${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(
                        user.walletAddress.length - 4
                      )}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.trustScore}</span>
                        <span className="text-xs text-slate-500">Level {user.trustLevel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30">
                          Admin
                        </Badge>
                      ) : user.trustScore > 50 ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30">
                          Verified
                        </Badge>
                      ) : user.trustScore > 0 ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30">
                          Member
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800/30">
                          New
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Trust Score</DropdownMenuItem>
                          <DropdownMenuItem>Assign Badge</DropdownMenuItem>
                          <DropdownMenuItem>Reset NFT</DropdownMenuItem>
                          {user.isAdmin ? (
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Remove Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                              Make Admin
                            </DropdownMenuItem>
                          )}
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
