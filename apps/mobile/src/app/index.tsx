import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {LinkList, AddLinkForm, SharedLinkProcessor} from '../components';
import {LoginScreen} from '../components/LoginScreen';
import {colors} from '../theme';
import {shareHandler, type SharedLinkData} from '../services';
import {useAuth} from '../contexts/AuthContext';

export default function HomeScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sharedLinkData, setSharedLinkData] = useState<SharedLinkData | null>(null);
  const [isSharedLinkVisible, setIsSharedLinkVisible] = useState(false);
  const {isAuthenticated, isLoading, logout, user} = useAuth();

  // Get URL parameters from share extension
  const {url, text} = useLocalSearchParams<{url?: string; text?: string}>();

  useEffect(() => {
    // Initialize share handler for deep links
    shareHandler.initialize();

    // Listen for shared URLs from deep links
    const removeShareListener = shareHandler.addListener((data: SharedLinkData) => {
      setSharedLinkData(data);
      setIsSharedLinkVisible(true);
    });

    // Handle URL parameters from share extension
    if (url) {
      const shareData: SharedLinkData = {
        url: decodeURIComponent(url),
        title: text ? decodeURIComponent(text) : undefined,
      };
      setSharedLinkData(shareData);
      setIsSharedLinkVisible(true);
    }

    // Cleanup on unmount
    return () => {
      removeShareListener();
      shareHandler.cleanup();
    };
  }, [url, text]);

  const handleCloseSharedLink = () => {
    setIsSharedLinkVisible(false);
    setSharedLinkData(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.linkAccent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Crate</Text>
          <Text style={styles.userGreeting}>Welcome, {user?.name}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsFormVisible(true)}>
            <Text style={styles.addButtonText}>+ Add Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LinkList />

      <AddLinkForm visible={isFormVisible} onClose={() => setIsFormVisible(false)} />

      <SharedLinkProcessor
        visible={isSharedLinkVisible}
        sharedData={sharedLinkData}
        onClose={handleCloseSharedLink}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.muted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  userGreeting: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: colors.muted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  logoutButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.linkAccent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
});
