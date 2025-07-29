/**
 * Perplexity API Key Input Component
 * For users to input their Perplexity API key when needed
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, ExternalLink, Key } from 'lucide-react';

interface PerplexityApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string) => void;
  title?: string;
  description?: string;
}

export const PerplexityApiKeyModal: React.FC<PerplexityApiKeyModalProps> = ({
  open,
  onOpenChange,
  onApiKeySubmit,
  title = "Perplexity API Key Required",
  description = "To provide intelligent analysis and answer your questions, Data Detective needs access to Perplexity AI."
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      onApiKeySubmit(apiKey.trim());
      setApiKey('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && apiKey.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Note:</strong> This project is connected to Supabase. For production use, 
              add your Perplexity API key to the Edge Function secrets instead of entering it here.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="perplexity-api-key">Perplexity API Key</Label>
            <div className="relative">
              <Input
                id="perplexity-api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have a Perplexity API key?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://docs.perplexity.ai/guides/getting-started', '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Perplexity API Key
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!apiKey.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              Your API key is stored locally and will be used for this session only. 
              It's not stored on our servers.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};