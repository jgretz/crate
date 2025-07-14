import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {LinkList, AddLinkForm} from './src/components';
import {colors} from './src/theme';

const queryClient = new QueryClient();

function MainApp() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crate</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Link</Text>
        </TouchableOpacity>
      </View>

      <LinkList />

      <AddLinkForm visible={isFormVisible} onClose={() => setIsFormVisible(false)} />

      <StatusBar style='light' />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
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
