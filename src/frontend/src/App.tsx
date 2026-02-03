import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useUpdateLastOnline } from './hooks/useQueries';
import LoginPage from './pages/LoginPage';
import MainApp from './pages/MainApp';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const updateLastOnline = useUpdateLastOnline();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Update last online timestamp periodically when authenticated
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      updateLastOnline.mutate();
      const interval = setInterval(() => {
        updateLastOnline.mutate();
      }, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userProfile]);

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  return <MainApp />;
}
