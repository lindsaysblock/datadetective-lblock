
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardView from '../components/dashboard/DashboardView';
import { ParsedData } from '@/utils/dataParser';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Empty placeholder data for the dashboard view
  const emptyData: ParsedData = {
    columns: [],
    rows: [],
    rowCount: 0,
    fileSize: 0,
    summary: {
      totalRows: 0,
      totalColumns: 0
    }
  };

  // Empty arrays for findings and recommendations
  const findings: any[] = [];
  const recommendations: any[] = [];

  const handleStartNewProject = () => {
    navigate('/new-project');
  };

  const handleContinueProject = () => {
    navigate('/query-history');
  };

  return (
    <DashboardView
      activeTab="welcome"
      onTabChange={() => {}}
      data={emptyData}
      findings={findings}
      recommendations={recommendations}
      onStartNewProject={handleStartNewProject}
      onContinueProject={handleContinueProject}
    />
  );
};

export default Dashboard;
