import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {LinkList, AddLinkForm, SharedLinkProcessor} from '../components';
import {colors} from '../theme';
import {shareHandler, receiveSharingHandler, type SharedLinkData, type ProcessedSharedData} from '../services';

export default function HomeScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sharedLinkData, setSharedLinkData] = useState<SharedLinkData | ProcessedSharedData | null>(null);
  const [isSharedLinkVisible, setIsSharedLinkVisible] = useState(false);

  useEffect(() => {
    // Initialize both share handlers
    shareHandler.initialize();
    receiveSharingHandler.initialize();

    // Listen for shared URLs from the original handler (deep links)
    const removeShareListener = shareHandler.addListener((data: SharedLinkData) => {
      setSharedLinkData(data);
      setIsSharedLinkVisible(true);
    });

    // Listen for shared content from the receive sharing handler (share sheet)
    const removeReceiveListener = receiveSharingHandler.addListener((data: ProcessedSharedData) => {
      setSharedLinkData(data);
      setIsSharedLinkVisible(true);
    });

    // Cleanup on unmount
    return () => {
      removeShareListener();
      removeReceiveListener();
      shareHandler.cleanup();
      receiveSharingHandler.cleanup();
    };
  }, []);

  const handleCloseSharedLink = () => {
    setIsSharedLinkVisible(false);
    setSharedLinkData(null);
  };

  // Development helper - simulate sharing for testing
  const handleTestShare = () => {
    const testUrl = 'https://github.com';
    shareHandler.handleSharedText(`Check out this link: ${testUrl}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crate</Text>
        <View style={styles.headerButtons}>
          {__DEV__ && (
            <TouchableOpacity style={styles.testButton} onPress={handleTestShare}>
              <Text style={styles.testButtonText}>Test Share</Text>
            </TouchableOpacity>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
