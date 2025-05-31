
import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your Web3 preferences and account settings</p>
        </div>

        {/* Wallet Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet & Network
            </CardTitle>
            <CardDescription>
              Manage your connected wallet and blockchain network preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Connected Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  id="wallet"
                  value={walletAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={handleDisconnectWallet}>
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Preferred Network</Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Token & Rewards Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Tokens & Rewards
            </CardTitle>
            <CardDescription>
              Configure how you want to handle your earned tokens and rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-stake">Auto-stake Rewards</Label>
                <p className="text-sm text-gray-500">
                  Automatically stake earned tokens for additional rewards
                </p>
              </div>
              <Switch
                id="auto-stake"
                checked={autoStakeRewards}
                onCheckedChange={setAutoStakeRewards}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Minimum Withdrawal Amount</Label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="100" className="w-32" />
                <span className="text-sm text-gray-500">LEARN tokens</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gas Fee Preference</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select gas preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow (Lower fees)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="fast">Fast (Higher fees)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy settings and data sharing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privacy-mode">Privacy Mode</Label>
                <p className="text-sm text-gray-500">
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
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-gray-500">
                  Allow others to view your achievements and NFT collection
                </p>
              </div>
              <Switch
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Data Sharing</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="analytics" className="rounded" defaultChecked />
                  <Label htmlFor="analytics" className="text-sm">
                    Share anonymous analytics to improve the platform
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="research" className="rounded" />
                  <Label htmlFor="research" className="text-sm">
                    Participate in educational research studies
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications about learning milestones and rewards
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="rewards-notif" className="rounded" defaultChecked />
                <Label htmlFor="rewards-notif" className="text-sm">
                  Token rewards and airdrops
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="course-notif" className="rounded" defaultChecked />
                <Label htmlFor="course-notif" className="text-sm">
                  Course completions and achievements
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="community-notif" className="rounded" />
                <Label htmlFor="community-notif" className="text-sm">
                  Community updates and events
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="governance-notif" className="rounded" />
                <Label htmlFor="governance-notif" className="text-sm">
                  Governance proposals and voting
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT & Digital Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              NFTs & Digital Assets
            </CardTitle>
            <CardDescription>
              Manage your educational NFTs and digital certificates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Display Preferences</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select display option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Show all NFTs</SelectItem>
                  <SelectItem value="achievements">Achievements only</SelectItem>
                  <SelectItem value="certificates">Certificates only</SelectItem>
                  <SelectItem value="hidden">Hide all</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-mint" className="rounded" defaultChecked />
              <Label htmlFor="auto-mint" className="text-sm">
                Auto-mint completion certificates as NFTs
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="marketplace" className="rounded" />
              <Label htmlFor="marketplace" className="text-sm">
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
    </div>
  );
};

export default Settings;
