
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Wallet, Shield, Globe, Coins, Bell, User, Eye } from 'lucide-react';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6635Cb9532991f5a1e9F27c5d9F542B0');
  const [autoStakeRewards, setAutoStakeRewards] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [privacyMode, setPrivacyMode] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your Web3 settings have been updated successfully.",
    });
  };

  const handleDisconnectWallet = () => {
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected from the platform.",
      variant: "destructive",
    });
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
              <p className="text-gray-400 mt-2">Manage your Web3 preferences and account settings</p>
            </div>

            {/* Wallet Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5" />
                  Wallet & Network
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your connected wallet and blockchain network preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet" className="text-white">Connected Wallet Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wallet"
                      value={walletAddress}
                      readOnly
                      className="font-mono text-sm bg-gray-800 border-gray-700 text-white"
                    />
                    <Button variant="outline" onClick={handleDisconnectWallet} className="border-gray-700 text-white hover:bg-gray-800">
                      Disconnect
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network" className="text-white">Preferred Network</Label>
                  <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="ethereum" className="text-white hover:bg-gray-700">Ethereum Mainnet</SelectItem>
                      <SelectItem value="polygon" className="text-white hover:bg-gray-700">Polygon</SelectItem>
                      <SelectItem value="arbitrum" className="text-white hover:bg-gray-700">Arbitrum</SelectItem>
                      <SelectItem value="optimism" className="text-white hover:bg-gray-700">Optimism</SelectItem>
                      <SelectItem value="base" className="text-white hover:bg-gray-700">Base</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Token & Rewards Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Coins className="h-5 w-5" />
                  Tokens & Rewards
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how you want to handle your earned tokens and rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-stake" className="text-white">Auto-stake Rewards</Label>
                    <p className="text-sm text-gray-400">
                      Automatically stake earned tokens for additional rewards
                    </p>
                  </div>
                  <Switch
                    id="auto-stake"
                    checked={autoStakeRewards}
                    onCheckedChange={setAutoStakeRewards}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <Label className="text-white">Minimum Withdrawal Amount</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="100" className="w-32 bg-gray-800 border-gray-700 text-white" />
                    <span className="text-sm text-gray-400">LEARN tokens</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Gas Fee Preference</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select gas preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="slow" className="text-white hover:bg-gray-700">Slow (Lower fees)</SelectItem>
                      <SelectItem value="standard" className="text-white hover:bg-gray-700">Standard</SelectItem>
                      <SelectItem value="fast" className="text-white hover:bg-gray-700">Fast (Higher fees)</SelectItem>
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
                      Allow others to view your achievements and NFT collection
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <Label className="text-white">Data Sharing</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="analytics" className="rounded" defaultChecked />
                      <Label htmlFor="analytics" className="text-sm text-white">
                        Share anonymous analytics to improve the platform
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="research" className="rounded" />
                      <Label htmlFor="research" className="text-sm text-white">
                        Participate in educational research studies
                      </Label>
                    </div>
                  </div>
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
                      Token rewards and airdrops
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
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="governance-notif" className="rounded" />
                    <Label htmlFor="governance-notif" className="text-sm text-white">
                      Governance proposals and voting
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT & Digital Assets */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  NFTs & Digital Assets
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your educational NFTs and digital certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Display Preferences</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select display option" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-gray-700">Show all NFTs</SelectItem>
                      <SelectItem value="achievements" className="text-white hover:bg-gray-700">Achievements only</SelectItem>
                      <SelectItem value="certificates" className="text-white hover:bg-gray-700">Certificates only</SelectItem>
                      <SelectItem value="hidden" className="text-white hover:bg-gray-700">Hide all</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-mint" className="rounded" defaultChecked />
                  <Label htmlFor="auto-mint" className="text-sm text-white">
                    Auto-mint completion certificates as NFTs
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="marketplace" className="rounded" />
                  <Label htmlFor="marketplace" className="text-sm text-white">
                    Allow trading of achievement NFTs on marketplace
                  </Label>
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
