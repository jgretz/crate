import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {close, openHostApp} from 'expo-share-extension';
import type {InitialProps} from 'expo-share-extension';

export default function ShareExtension({url, text}: InitialProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveLink = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // Extract URL from text if needed
      const linkUrl = url || extractUrlFromText(text);

      if (!linkUrl) {
        Alert.alert('No URL found', 'No valid URL was found in the shared content.');
        setIsProcessing(false);
        return;
      }

      // Open the main app with the URL
      const encodedUrl = encodeURIComponent(linkUrl);
      const encodedText = encodeURIComponent(text || '');
      await openHostApp(`?url=${encodedUrl}&text=${encodedText}`);

      // Close the share extension
      close();
    } catch (error) {
      console.error('Error saving link:', error);
      Alert.alert('Error', 'Failed to save the link. Please try again.');
      setIsProcessing(false);
    }
  };

  const extractUrlFromText = (text?: string): string | null => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  };

  const displayUrl = url || extractUrlFromText(text);
  const displayText = text && text.length > 100 ? text.substring(0, 100) + '...' : text;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Save to Crate</Text>
      </View>

      <View style={styles.content}>
        {displayUrl && (
          <View style={styles.urlContainer}>
            <Text style={styles.label}>URL:</Text>
            <Text style={styles.url} numberOfLines={2}>
              {displayUrl}
            </Text>
          </View>
        )}

        {displayText && displayText !== displayUrl && (
          <View style={styles.textContainer}>
            <Text style={styles.label}>Text:</Text>
            <Text style={styles.text} numberOfLines={3}>
              {displayText}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelButton} onPress={close} disabled={isProcessing}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isProcessing && styles.disabledButton]}
          onPress={handleSaveLink}
          disabled={isProcessing || !displayUrl}
        >
          <Text style={styles.saveButtonText}>{isProcessing ? 'Saving...' : 'Save Link'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  urlContainer: {
    marginBottom: 15,
  },
  textContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 5,
  },
  url: {
    fontSize: 16,
    color: '#007AFF',
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
});
