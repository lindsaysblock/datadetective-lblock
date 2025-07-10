
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Eye, Database, AlertTriangle } from 'lucide-react';

interface PrivacySecurityModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  dataType: 'upload' | 'connection';
  sourceName?: string;
}

const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  dataType,
  sourceName
}) => {
  const [hasReadTerms, setHasReadTerms] = React.useState(false);
  const [acknowledgeRisks, setAcknowledgeRisks] = React.useState(false);
  const [consentToProcessing, setConsentToProcessing] = React.useState(false);

  const canProceed = hasReadTerms && acknowledgeRisks && consentToProcessing;

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Privacy & Security Notice
          </DialogTitle>
          <DialogDescription>
            Please review the following privacy and security information before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Important:</strong> This application processes data locally in your browser. 
              However, please review all terms carefully before {dataType === 'upload' ? 'uploading' : 'connecting'} your data.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">Data Processing</h3>
                <p className="text-sm text-gray-600">
                  Your data is processed locally in your browser. No data is sent to external servers 
                  unless you explicitly connect to external data sources. All processing happens 
                  client-side for maximum privacy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Data Security</h3>
                <p className="text-sm text-gray-600">
                  {dataType === 'upload' 
                    ? 'Uploaded files are temporarily stored in your browser memory and are automatically cleared when you close the application.'
                    : `Connection credentials are encrypted and stored securely. We recommend using read-only access when possible.`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold">Data Visibility</h3>
                <p className="text-sm text-gray-600">
                  Only you have access to your data during this session. Data Detective does not 
                  store, log, or transmit your personal or business data to any external services 
                  without your explicit consent.
                </p>
              </div>
            </div>
          </div>

          {dataType === 'connection' && sourceName && (
            <Alert>
              <AlertDescription>
                <strong>External Connection:</strong> You are connecting to {sourceName}. 
                Please ensure you have proper authorization to access this data source and 
                that your connection complies with your organization's data governance policies.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Your Rights & Responsibilities</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You retain full ownership of your data</li>
              <li>• You can delete or disconnect your data at any time</li>
              <li>• You are responsible for ensuring you have permission to analyze this data</li>
              <li>• You should not upload sensitive data unless necessary for your analysis</li>
              <li>• Any insights generated remain your intellectual property</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={hasReadTerms}
                onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm">
                I have read and understand the privacy and security terms above
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="risks" 
                checked={acknowledgeRisks}
                onCheckedChange={(checked) => setAcknowledgeRisks(checked as boolean)}
              />
              <label htmlFor="risks" className="text-sm">
                I acknowledge the risks associated with data processing and take full responsibility
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={consentToProcessing}
                onCheckedChange={(checked) => setConsentToProcessing(checked as boolean)}
              />
              <label htmlFor="consent" className="text-sm">
                I consent to the local processing of my data as described above
              </label>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Legal Disclaimer:</strong> This software is provided "as is" without warranty. 
            Users are responsible for ensuring compliance with applicable data protection laws 
            (GDPR, CCPA, etc.) and their organization's data policies. Always verify you have 
            proper authorization before processing any data.
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!canProceed}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacySecurityModal;
