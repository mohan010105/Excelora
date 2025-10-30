import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Trash2,
  AlertTriangle,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  session: any;
}

export function Settings({ session }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    insights: true,
    uploads: false,
  });
  
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  const userName = session?.user?.user_metadata?.name || 'User';
  const userEmail = session?.user?.email || '';

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in this demo');
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <SettingsIcon className="h-5 w-5 text-blue-600" />
              </motion.div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Settings</span>
            </CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={userEmail} disabled />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC-08:00 (Pacific Time)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English (US)" />
              </div>

              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Email Notifications</div>
                    <div className="text-xs text-gray-500">
                      Receive email updates about your account
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">AI Insights Ready</div>
                    <div className="text-xs text-gray-500">
                      Get notified when AI insights are generated
                    </div>
                  </div>
                  <Switch
                    checked={notifications.insights}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, insights: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Upload Completion</div>
                    <div className="text-xs text-gray-500">
                      Notifications when file uploads complete
                    </div>
                  </div>
                  <Switch
                    checked={notifications.uploads}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, uploads: checked })
                    }
                  />
                </div>
              </div>

              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Data Sharing</div>
                    <div className="text-xs text-gray-500">
                      Allow anonymous data sharing to improve our services
                    </div>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, dataSharing: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Usage Analytics</div>
                    <div className="text-xs text-gray-500">
                      Help us improve by sharing anonymous usage data
                    </div>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, analytics: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data Management</h4>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Export Your Data</div>
                    <div className="text-xs text-gray-500">
                      Download all your data and insights
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    <Download className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                  <div>
                    <div className="text-sm font-medium text-red-900">Delete Account</div>
                    <div className="text-xs text-red-700">
                      Permanently delete your account and all data
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Advanced Settings</span>
              </CardTitle>
              <CardDescription>
                Advanced configuration options and API settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">API Configuration</h4>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="api-key"
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      API key for external integrations (Optional)
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">Enable High Performance Mode</div>
                        <div className="text-xs text-gray-500">
                          Faster processing at higher resource usage
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">
                        Advanced Settings Warning
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        These settings can affect application performance. Change only if you know what you're doing.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </motion.div>
    </motion.div>
  );
}