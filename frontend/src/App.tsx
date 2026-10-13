import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CommandCenter } from './pages/CommandCenter';
import { Workflows } from './pages/Workflows';
import { Insights } from './pages/Insights';
import { Leads } from './pages/Leads';
import { SalesCalls } from './pages/SalesCalls';
import { Clients } from './pages/Clients';
import { Proposals } from './pages/Proposals';
import { Strategies } from './pages/Strategies';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Content } from './pages/Content';
import { DesignerWorkspace } from './pages/DesignerWorkspace';
import { VideoWorkspace } from './pages/VideoWorkspace';
import { Approvals } from './pages/Approvals';
import { CalendarView } from './pages/CalendarView';
import { Invoices } from './pages/Invoices';
import { Payments } from './pages/Payments';
import { Finance } from './pages/Finance';
import { Communications } from './pages/Communications';
import { Team } from './pages/Team';
import { AssetLibrary } from './pages/AssetLibrary';
import { Reports } from './pages/Reports';
import { ClientPortal } from './pages/ClientPortal';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="command-center" element={<CommandCenter />} />
              <Route path="insights" element={<Insights />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="leads" element={<Leads />} />
              <Route path="sales" element={<SalesCalls />} />
              <Route path="clients" element={<Clients />} />
              <Route path="proposals" element={<Proposals />} />
              <Route path="strategies" element={<Strategies />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="content" element={<Content />} />
              <Route path="design" element={<DesignerWorkspace />} />
              <Route path="video" element={<VideoWorkspace />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<Payments />} />
              <Route path="finance" element={<Finance />} />
              <Route path="communications" element={<Communications />} />
              <Route path="team" element={<Team />} />
              <Route path="documents" element={<AssetLibrary />} />
              <Route path="reports" element={<Reports />} />
              <Route path="client-portal" element={<ClientPortal />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
