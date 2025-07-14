import React from 'react';
import {FlatList, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {getLinks, deleteLink, type LinksResponse} from '../services';
import type {Link} from '@crate/domain';
import {LinkCard} from './LinkCard';

function LoadingState() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size='large' color='#0066cc' />
      <Text style={styles.loadingText}>Loading links...</Text>
    </View>
  );
}

function ErrorState() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>Failed to load links. Please try again.</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>No links yet. Add your first link!</Text>
    </View>
  );
}

interface LinksListProps {
  links: Link[];
  onDelete: (linkId: string) => void;
}

function LinksList({links, onDelete}: LinksListProps) {
  return (
    <FlatList
      data={links}
      keyExtractor={(item) => item._id?.toString() || ''}
      renderItem={({item}) => (
        <LinkCard link={item} onDelete={() => onDelete(item._id?.toString() || '')} />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

export function LinkList() {
  const queryClient = useQueryClient();

  const {data, isLoading, error} = useQuery<LinksResponse>({
    queryKey: ['links'],
    queryFn: getLinks,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['links']});
    },
  });

  const handleDelete = (linkId: string) => {
    deleteLinkMutation.mutate(linkId);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const links = data?.links || [];

  if (links.length === 0) {
    return <EmptyState />;
  }

  return <LinksList links={links} onDelete={handleDelete} />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
});
