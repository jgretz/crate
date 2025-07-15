import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {colors} from '../theme';
import {shareHandler, type SharedLinkData} from '../services';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface SharedLinkProcessorProps {
  visible: boolean;
  sharedData: SharedLinkData | null;
  onClose: () => void;
}

export function SharedLinkProcessor({visible, sharedData, onClose}: SharedLinkProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const processSharedLinkMutation = useMutation({
    mutationFn: (url: string) => shareHandler.processSharedUrl(url),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['links']});
      Alert.alert('Success', 'Link saved successfully!', [{text: 'OK', onPress: onClose}]);
    },
    onError: (error) => {
      console.error('Error saving shared link:', error);
      Alert.alert('Error', 'Failed to save the link. Please try again.', [
        {text: 'Cancel', style: 'cancel', onPress: onClose},
        {text: 'Retry', onPress: handleSave},
      ]);
    },
  });

  const handleSave = async () => {
    if (!sharedData?.url) return;

    setIsProcessing(true);
    try {
      await processSharedLinkMutation.mutateAsync(sharedData.url);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!sharedData) return null;

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} disabled={isProcessing}>
            <Text style={[styles.cancelButton, isProcessing && styles.disabledButton]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Save Shared Link</Text>
          <TouchableOpacity onPress={handleSave} disabled={isProcessing}>
            <Text style={[styles.saveButton, isProcessing && styles.disabledButton]}>
              {isProcessing ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size='large' color={colors.linkAccent} />
              <Text style={styles.processingText}>Fetching page information...</Text>
            </View>
          ) : (
            <View style={styles.linkInfo}>
              <Text style={styles.label}>URL:</Text>
              <Text style={styles.url} numberOfLines={3}>
                {sharedData.url}
              </Text>

              <Text style={styles.infoText}>
                We'll fetch the page title and description automatically when you save this link.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  saveButton: {
    fontSize: 16,
    color: colors.linkAccent,
    fontWeight: 'bold',
  },
  disabledButton: {
    color: colors.mutedForeground,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  linkInfo: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 8,
  },
  url: {
    fontSize: 14,
    color: colors.linkAccent,
    backgroundColor: colors.input,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
    textAlign: 'center',
  },
});
