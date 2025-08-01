import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {AuthProvider} from '../contexts/AuthContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <StatusBar style='light' />
      </QueryClientProvider>
    </AuthProvider>
  );
}
