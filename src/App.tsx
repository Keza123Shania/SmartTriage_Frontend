import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { RoleGuard } from './components/RoleGuard';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Dashboard } from './modules/dashboard/Dashboard';
import { EntryRegistration } from './modules/entry/EntryRegistration';
import { PediatricTriageForm } from './modules/triage/PediatricTriageForm';
import { AdultTriageForm } from './modules/triage/AdultTriageForm';
import { TriageQueue } from './modules/triage/TriageQueue';
import { VitalMonitoring } from './modules/vitals/VitalMonitoring';
import { ConstantMonitoring } from './modules/monitoring/ConstantMonitoring';
import { AlertsView } from './modules/alerts/AlertsView';
import { ReportsView } from './modules/reports/ReportsView';
import { SettingsView } from './modules/settings/SettingsView';
import { NotificationsPage } from './modules/notifications/NotificationsPage';
import { ProfilePage } from './modules/profile/ProfilePage';
import { PatientsList } from './modules/patients/PatientsList';
import { PatientDetailView } from './modules/patient/PatientDetailView';
import { AuditTrail } from './modules/audit/AuditTrail';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarWidth, setSidebarWidth] = useState(72); // Default collapsed width
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, pageBg } = useTheme();

  // Full-screen pages (no sidebar)
  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  const handleSidebarExpand = () => {
    setSidebarWidth(272);
  };

  const handleSidebarCollapse = () => {
    setSidebarWidth(72);
  };

  // Landing page — full screen, no sidebar
  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    );
  }

  // Auth pages — full screen, no sidebar
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    );
  }

  return (
    <div
      className="flex h-screen bg-mesh transition-colors duration-500"
      style={{ background: pageBg }}
    >
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onCollapse={handleSidebarCollapse}
        onExpand={handleSidebarExpand}
        isExpanded={sidebarWidth === 272}
      />

      <main
        className="flex-1 min-w-0 overflow-y-auto transition-all duration-500 ease-out relative"
        style={{ marginLeft: `${sidebarWidth + 32}px` }}
      >
        <div className="relative z-10 animate-fade-in">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entry" element={<RoleGuard page="entry"><EntryRegistration /></RoleGuard>} />
            <Route path="/patients" element={<RoleGuard page="patients"><PatientsList /></RoleGuard>} />
            <Route path="/patients/:patientId" element={<RoleGuard page="patients"><PatientDetailView /></RoleGuard>} />
            <Route path="/triage" element={<RoleGuard page="triage"><TriageQueue /></RoleGuard>} />
            <Route path="/pediatric-triage/new" element={<RoleGuard page="triage"><PediatricTriageForm /></RoleGuard>} />
            <Route path="/pediatric-triage/:patientId" element={<RoleGuard page="triage"><PediatricTriageForm /></RoleGuard>} />
            <Route path="/adult-triage/new" element={<RoleGuard page="triage"><AdultTriageForm /></RoleGuard>} />
            <Route path="/adult-triage/:patientId" element={<RoleGuard page="triage"><AdultTriageForm /></RoleGuard>} />
            <Route path="/vitals/:patientId" element={<RoleGuard page="monitoring"><VitalMonitoring /></RoleGuard>} />
            <Route path="/monitoring" element={<RoleGuard page="monitoring"><ConstantMonitoring /></RoleGuard>} />
            <Route path="/monitoring/:patientId" element={<RoleGuard page="monitoring"><VitalMonitoring /></RoleGuard>} />
            <Route path="/alerts" element={<RoleGuard page="alerts"><AlertsView /></RoleGuard>} />
            <Route path="/audit-trail" element={<RoleGuard page="audit-trail"><AuditTrail /></RoleGuard>} />
            <Route path="/reports" element={<RoleGuard page="reports"><ReportsView /></RoleGuard>} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<RoleGuard page="settings"><SettingsView /></RoleGuard>} />
          </Routes>
        </div>

        {/* Role Switcher (floating pill for dev/demo) */}
        <RoleSwitcher />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
