
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Wallet, Shield, User, Bell, Eye, Upload, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zkLoginAddress, setZkLoginAddress] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['defi', 'nfts']);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // Debug: Log current state
  useEffect(() => {
    console.log('Current state:', {
      zkLoginAddress,
      userName,
      profilePicture,
      isAuthenticated,
      user,
      notifications,
      publicProfile,
      privacyMode
    });
  }, [zkLoginAddress, userName, profilePicture, isAuthenticated, user, notifications, publicProfile, privacyMode]);

  // Update local state when user data changes
  useEffect(() => {
    // Debug: Log all localStorage items
    console.log('All localStorage items:', Object.entries(localStorage));
    
    let walletAddress = null;
    
    // Check for sui-dapp-kit wallet connection info
    const walletConnectionInfo = localStorage.getItem('sui-dapp-kit:wallet-connection-info');
    if (walletConnectionInfo) {
      try {
        const connectionInfo = JSON.parse(walletConnectionInfo);
        if (connectionInfo?.state?.lastConnectedAccountAddress) {
          walletAddress = connectionInfo.state.lastConnectedAccountAddress;
          console.log('Found wallet address in sui-dapp-kit connection info:', walletAddress);
        }
      } catch (e) {
        console.error('Error parsing wallet connection info:', e);
      }
    }
    
    // Fallback to checking common keys if not found in sui-dapp-kit
    if (!walletAddress) {
      const possibleWalletKeys = [
        'lastConnectedAccountAddress',
        'wallet-address',
        'connected-address',
        'account-address',
        'sui-wallet-address',
        'sui-account-address'
      ];
      
      for (const key of possibleWalletKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`Found potential wallet address in ${key}:`, value);
          walletAddress = value;
          break;
        }
      }
    }
    
    if (walletAddress) {
      console.log('Setting zkLoginAddress with:', walletAddress);
      setZkLoginAddress(walletAddress);
    } else {
      console.log('No wallet address found in localStorage');
      // Check if any localStorage key contains 'address' or 'wallet'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.toLowerCase().includes('address') || key.toLowerCase().includes('wallet'))) {
          console.log(`Found potential wallet-related key: ${key} = ${localStorage.getItem(key)}`);
        }
      }
    }
    
    if (user) {
      console.log('User data:', user);
      setUserName(user.name || '');
      // Check for profile picture in user object or localStorage
      const userWithAvatar = user as { avatar?: string };
      const userProfilePic = userWithAvatar.avatar || localStorage.getItem('userProfilePicture');
      if (userProfilePic) {
        setProfilePicture(userProfilePic);
      }
    }
  }, [user]);

  // Debug: Log when zkLoginAddress changes
  useEffect(() => {
    console.log('zkLoginAddress updated:', zkLoginAddress);
  }, [zkLoginAddress]);

  const availableInterests = [
    { id: 'defi', label: 'DeFi & Trading' },
    { id: 'nfts', label: 'NFTs & Digital Art' },
    { id: 'gaming', label: 'Blockchain Gaming' },
    { id: 'development', label: 'Smart Contract Development' },
    { id: 'dao', label: 'DAO & Governance' },
    { id: 'infrastructure', label: 'Blockchain Infrastructure' },
    { id: 'security', label: 'Security & Auditing' },
    { id: 'tokenomics', label: 'Tokenomics & Economics' }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your profile and preferences have been updated successfully.",
    });
  };

  const handleDisconnectZkLogin = () => {
    // Remove wallet address from localStorage
    localStorage.removeItem('lastConnectedAccountAddress');
    logout();
    setZkLoginAddress('');
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected from the platform.",
      variant: "default",
    });
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black flex w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-2">Manage your profile and Sui blockchain preferences</p>
            </div>

            {/* Profile Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your profile information and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label className="text-white">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profilePicture} />
                      <AvatarFallback className="text-lg">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="profile-upload" className="cursor-pointer">
                        <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800" asChild>
                          <span>
                            {zkLoginAddress ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">Upload</span>
                                </div>
          
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">No wallet connected</span>
                                </div>
                              </div>
                            )}
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                      />
                      {profilePicture && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setProfilePicture('')}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-white">Display Name</Label>
                  <Input
                    id="display-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your display name"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-white">Learning Interests</Label>
                  <p className="text-sm text-gray-400">
                    Select topics you're interested in to get personalized content recommendations
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableInterests.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={interest.id}
                          checked={selectedInterests.includes(interest.id)}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={interest.id} className="text-sm text-white cursor-pointer">
                          {interest.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* zkLogin & Sui Network Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5" />
                  zkLogin & Sui Network
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your zkLogin authentication and Sui blockchain preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zklogin" className="text-white">Connected zkLogin Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zklogin"
                      value={zkLoginAddress}
                      readOnly
                      className="font-mono text-sm bg-gray-800 border-gray-700 text-white"
                    />
                    <Button variant="outline" onClick={handleDisconnectZkLogin} className="border-gray-700 text-white hover:bg-gray-800">
                      Disconnect
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    zkLogin provides privacy-preserving authentication using zero-knowledge proofs
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network" className="text-white">Sui Network</Label>
                  <Select defaultValue="mainnet">
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mainnet" className="text-white hover:bg-gray-700">Sui Mainnet</SelectItem>
                      <SelectItem value="testnet" className="text-white hover:bg-gray-700">Sui Testnet</SelectItem>
                      <SelectItem value="devnet" className="text-white hover:bg-gray-700">Sui Devnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

{/* Privacy & Security */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control your privacy settings and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privacy-mode" className="text-white">Privacy Mode</Label>
                    <p className="text-sm text-gray-400">
                      Hide your wallet transactions and learning progress from public view
                    </p>
                  </div>
                  <Switch
                    id="privacy-mode"
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile" className="text-white">Public Profile</Label>
                    <p className="text-sm text-gray-400">
                      Allow others to view your achievements and learning progress
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">
                      Receive notifications about learning milestones and rewards
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="rewards-notif" className="rounded" defaultChecked />
                    <Label htmlFor="rewards-notif" className="text-sm text-white">
                      SUI token rewards and staking updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="course-notif" className="rounded" defaultChecked />
                    <Label htmlFor="course-notif" className="text-sm text-white">
                      Course completions and achievements
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="community-notif" className="rounded" />
                    <Label htmlFor="community-notif" className="text-sm text-white">
                      Community updates and events
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
