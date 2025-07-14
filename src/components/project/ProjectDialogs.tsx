
import React from 'react';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import { SignInModal } from '@/components/auth/SignInModal';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';

interface ProjectDialogsProps {
  formData: any;
  analysisProgress: number;
  onViewResults: () => void;
  onProjectConfirm: (projectName: string) => void;
}

const ProjectDialogs: React.FC<ProjectDialogsProps> = ({ 
  formData, 
  analysisProgress, 
  onViewResults,
  onProjectConfirm
}) => {
  console.log('ProjectDialogs rendering');

  return (
    <>
      <FormRecoveryDialog
        open={formData.showRecoveryDialog}
        onOpenChange={formData.setShowRecoveryDialog}
        onRestore={formData.handleRestoreData}
        onStartFresh={formData.handleStartFresh}
        lastSaved={formData.lastSaved}
      />

      <SignInModal
        open={formData.showSignInModal}
        onOpenChange={formData.setShowSignInModal}
        email={formData.email}
        password={formData.password}
        loading={formData.authLoading}
        setEmail={formData.setEmail}
        setPassword={formData.setPassword}
        onSignIn={formData.handleSignIn}
        onSignUp={formData.handleSignUp}
      />

      <ProjectNamingDialog
        open={formData.showProjectDialog}
        onOpenChange={(open) => {
          if (!formData.isProcessingAnalysis || formData.analysisCompleted) {
            formData.setShowProjectDialog(open);
          }
        }}
        onConfirm={onProjectConfirm}
        onViewResults={onViewResults}
        isProcessing={formData.isProcessingAnalysis}
        analysisProgress={analysisProgress}
        analysisCompleted={formData.analysisCompleted}
      />
    </>
  );
};

export default ProjectDialogs;
