'use client';

import { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type APIKey = {
  id: string;
  name: string;
  prefix: string;
  keySuffix: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
};

const PERMISSIONS = [
  'agents:read',
  'agents:write',
  'consultations:read',
  'consultations:write',
  'analytics:read',
  'billing:read',
];

export function APIKeysManager({ providerId }: { providerId: string }) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newKey, setNewKey] = useState<{ id: string; key: string } | null>(null);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const { toast } = useToast();

  // Fetch API keys
  useEffect(() => {
    const fetchAPIKeys = async () => {
      try {
        const response = await fetch(`/api/ai-provider/api-keys?providerId=${providerId}`);
        if (!response.ok) throw new Error('Failed to fetch API keys');
        const data = await response.json();
        setApiKeys(data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast({
          title: 'Error',
          description: 'Failed to load API keys',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchAPIKeys();
    }
  }, [providerId, toast]);

  // Create a new API key
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the API key',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch('/api/ai-provider/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          name: newKeyName,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) throw new Error('Failed to create API key');

      const data = await response.json();
      setNewKey({ id: data.id, key: data.key });
      setApiKeys([...apiKeys, {
        id: data.id,
        name: data.name,
        prefix: data.prefix,
        keySuffix: data.keySuffix,
        permissions: data.permissions,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
      }]);
      
      // Reset form
      setNewKeyName('');
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Revoke an API key
  const handleRevokeKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-provider/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke API key');

      // Update the local state to remove the key
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      
      toast({
        title: 'Success',
        description: 'API key has been revoked',
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke API key',
        variant: 'destructive',
      });
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'API key has been copied to clipboard',
    });
  };

  // Toggle permission selection
  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading) {
    return <div>Loading API keys...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`perm-${permission}`}
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`perm-${permission}`} className="text-sm font-normal">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleCreateKey}
                  disabled={isCreating || !newKeyName.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* New Key Modal */}
      {newKey && (
        <Dialog open={!!newKey} onOpenChange={(open) => !open && setNewKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Make sure to copy your API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={newKey.key}
                  readOnly
                  className="pr-10 font-mono"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => copyToClipboard(newKey.key)}
                >
                  {isKeyCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      For security reasons, this is the only time you'll be able to see the full API key. Make sure to copy it now and store it in a secure location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <p className="mb-2 text-lg font-medium">No API keys found</p>
                <p className="text-sm">Create your first API key to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{key.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {key.prefix}...{key.keySuffix}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`${key.prefix}...${key.keySuffix}`)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {key.permissions.map((permission) => (
                          <span key={permission} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Created {formatDate(key.createdAt)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {formatDate(key.expiresAt)}
                      </div>
                      {key.lastUsed && (
                        <div className="text-sm text-muted-foreground">
                          Last used {formatDate(key.lastUsed)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRevokeKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Documentation Link */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-2">API Documentation</h3>
        <p className="text-muted-foreground text-sm">
          Learn how to use the API with your new keys in our{' '}
          <a href="/docs/api" className="text-primary hover:underline">
            API documentation
          </a>.
        </p>
      </div>
    </div>
  );
}
