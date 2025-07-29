import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, ExternalLink, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIProviderType } from '@/types/aiProvider';
import { aiProviderManager } from '@/services/ai/aiProviderManager';

interface MultiProviderApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const providerInfo = {
  openai: {
    name: 'OpenAI',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...',
    description: 'Best for general data analysis and business insights',
  },
  claude: {
    name: 'Claude (Anthropic)',
    apiKeyUrl: 'https://console.anthropic.com/',
    placeholder: 'sk-ant-...',
    description: 'Excellent for complex reasoning and detailed analysis',
  },
  perplexity: {
    name: 'Perplexity',
    apiKeyUrl: 'https://www.perplexity.ai/settings/api',
    placeholder: 'pplx-...',
    description: 'Perfect for real-time data and web-based questions',
  },
};

export const MultiProviderApiKeyModal: React.FC<MultiProviderApiKeyModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  title = "Configure AI Providers",
  description = "Add API keys for one or more AI providers to enable analytics features"
}) => {
  const [apiKeys, setApiKeys] = useState<Record<AIProviderType, string>>({
    openai: aiProviderManager.getApiKey('openai') || '',
    claude: aiProviderManager.getApiKey('claude') || '',
    perplexity: aiProviderManager.getApiKey('perplexity') || '',
  });
  
  const [showKeys, setShowKeys] = useState<Record<AIProviderType, boolean>>({
    openai: false,
    claude: false,
    perplexity: false,
  });
  
  const [isValidating, setIsValidating] = useState<Record<AIProviderType, boolean>>({
    openai: false,
    claude: false,
    perplexity: false,
  });
  
  const [validationResults, setValidationResults] = useState<Record<AIProviderType, boolean | null>>({
    openai: null,
    claude: null,
    perplexity: null,
  });

  const handleApiKeyChange = (provider: AIProviderType, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    setValidationResults(prev => ({ ...prev, [provider]: null }));
  };

  const toggleShowKey = (provider: AIProviderType) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const validateApiKey = async (provider: AIProviderType) => {
    const apiKey = apiKeys[provider].trim();
    if (!apiKey) return;

    setIsValidating(prev => ({ ...prev, [provider]: true }));
    
    try {
      const providerInstance = aiProviderManager.getProvider(provider);
      const isValid = await providerInstance?.validateApiKey(apiKey);
      setValidationResults(prev => ({ ...prev, [provider]: isValid || false }));
    } catch (error) {
      setValidationResults(prev => ({ ...prev, [provider]: false }));
    } finally {
      setIsValidating(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleSave = () => {
    let hasValidKey = false;
    
    Object.entries(apiKeys).forEach(([provider, key]) => {
      const trimmedKey = key.trim();
      if (trimmedKey) {
        aiProviderManager.setApiKey(provider as AIProviderType, trimmedKey);
        hasValidKey = true;
      }
    });

    if (hasValidKey) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const hasConfiguredProvider = Object.values(apiKeys).some(key => key.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(providerInfo).map(([key, info]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                {info.name}
                {aiProviderManager.getProvider(key as AIProviderType)?.isConfigured && (
                  <Check className="h-3 w-3 text-green-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(providerInfo).map(([provider, info]) => (
            <TabsContent key={provider} value={provider} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${provider}-key`}>{info.name} API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={`${provider}-key`}
                      type={showKeys[provider as AIProviderType] ? 'text' : 'password'}
                      placeholder={info.placeholder}
                      value={apiKeys[provider as AIProviderType]}
                      onChange={(e) => handleApiKeyChange(provider as AIProviderType, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          validateApiKey(provider as AIProviderType);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleShowKey(provider as AIProviderType)}
                    >
                      {showKeys[provider as AIProviderType] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => validateApiKey(provider as AIProviderType)}
                    disabled={!apiKeys[provider as AIProviderType].trim() || isValidating[provider as AIProviderType]}
                    size="sm"
                  >
                    {isValidating[provider as AIProviderType] ? 'Validating...' : 'Test'}
                  </Button>
                </div>
                
                {validationResults[provider as AIProviderType] !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    {validationResults[provider as AIProviderType] ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">API key is valid</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Invalid API key</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Alert>
                <AlertDescription>
                  <strong>{info.description}</strong>
                  <br />
                  Get your API key from:{' '}
                  <a
                    href={info.apiKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {info.apiKeyUrl.replace('https://', '')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
            </TabsContent>
          ))}
        </Tabs>

        <Alert>
          <AlertDescription>
            <strong>Privacy & Security:</strong> API keys are stored locally in your browser and never sent to our servers.
            You can configure multiple providers and the system will choose the best one for each question.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasConfiguredProvider}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Backward compatibility
export const PerplexityApiKeyModal = MultiProviderApiKeyModal;