
import React from 'react';
import { Separator } from '@/components/ui/separator';

const LegalFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Data Security</h3>
            <ul className="space-y-1">
              <li>• All data is encrypted in transit and at rest</li>
              <li>• Your data is never shared with third parties</li>
              <li>• You maintain full ownership of your datasets</li>
              <li>• SOC 2 Type II compliant infrastructure</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Usage Guidelines</h3>
            <ul className="space-y-1">
              <li>• For business intelligence and analytics only</li>
              <li>• Do not upload personally identifiable information</li>
              <li>• Comply with your organization's data policies</li>
              <li>• Report any security concerns immediately</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-1">
              <li>• <a href="/terms" className="hover:underline">Terms of Service</a></li>
              <li>• <a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li>• <a href="/compliance" className="hover:underline">Compliance</a></li>
              <li>• <a href="/support" className="hover:underline">Support</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2024 Data Detective. All rights reserved.</p>
          <p>
            <strong>Disclaimer:</strong> AI-generated insights are suggestions only. 
            Always verify results and consult domain experts for critical decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;
