'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    apiKey: '',
    primaryColor: '#007bff',
    fontFamily: 'Inter',
    position: 'right',
    welcomeMessage: 'Hi! How can I help you today?',
    selectedModel: 'openai/gpt-3.5-turbo',
  });

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const embedCode = `<script>
  window.ChatWidgetSettings = {
    apiKey: "${settings.apiKey}",
    primaryColor: "${settings.primaryColor}",
    fontFamily: "${settings.fontFamily}",
    position: "${settings.position}",
    welcomeMessage: "${settings.welcomeMessage}",
    selectedModel: "${settings.selectedModel}"
  };
</script>
<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" async></script>`;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="apiKey">OpenRouter API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, apiKey: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) =>
                    setSettings({ ...settings, fontFamily: value })
                  }
                >
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="position">Widget Position</Label>
                <Select
                  value={settings.position}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      position: value as 'left' | 'right',
                    })
                  }
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={(e) =>
                    setSettings({ ...settings, welcomeMessage: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="selectedModel">AI Model</Label>
                <Select
                  value={settings.selectedModel}
                  onValueChange={(value) =>
                    setSettings({ ...settings, selectedModel: value })
                  }
                >
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4">GPT-4</option>
                  <option value="anthropic/claude-2">Claude 2</option>
                </Select>
              </div>

              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <p className="text-muted-foreground">
              Analytics features coming soon...
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card className="p-6">
            <Label>Embed Code</Label>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast({
                  title: 'Copied!',
                  description: 'Embed code copied to clipboard',
                });
              }}
            >
              Copy Code
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}