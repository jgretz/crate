import React from 'react';
import {FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {getLinks, deleteLink, type LinksResponse} from '../services';
import type {Link} from '@crate/domain';
import {LinkCard} from './LinkCard';
import {colors} from '../theme';

function LoadingState() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size='large' color={colors.linkAccent} />
      <Text style={styles.loadingText}>Loading links...</Text>
    </View>
  );
}

function ErrorState({isRefreshing, onRefresh}: {isRefreshing: boolean; onRefresh: () => void}) {
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.list}
      contentContainerStyle={styles.centerContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.linkAccent}
          colors={[colors.linkAccent]}
          progressBackgroundColor={colors.card}
        />
      }
      ListEmptyComponent={
        <Text style={styles.errorText}>Failed to load links. Pull down to retry.</Text>
      }
    />
  );
}

function EmptyState({isRefreshing, onRefresh}: {isRefreshing: boolean; onRefresh: () => void}) {
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.list}
      contentContainerStyle={styles.centerContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.linkAccent}
          colors={[colors.linkAccent]}
          progressBackgroundColor={colors.card}
        />
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>No links yet. Add your first link!</Text>
      }
    />
  );
}

interface LinksListProps {
  links: Link[];
  onDelete: (linkId: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function LinksList({links, onDelete, isRefreshing, onRefresh}: LinksListProps) {
  return (
    <FlatList
      data={links}
      keyExtractor={(item) => item._id?.toString() || ''}
      renderItem={({item}) => (
        <LinkCard link={item} onDelete={() => onDelete(item._id?.toString() || '')} />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.linkAccent}
          colors={[colors.linkAccent]}
          progressBackgroundColor={colors.card}
        />
      }
    />
  );
}

export function LinkList() {
  const queryClient = useQueryClient();

  const {data, isLoading, error, refetch, isFetching} = useQuery<LinksResponse>({
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

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState isRefreshing={isFetching} onRefresh={handleRefresh} />;
  }

  const links = data?.links || [];

  if (links.length === 0) {
    return <EmptyState isRefreshing={isFetching} onRefresh={handleRefresh} />;
  }

  return (
    <LinksList 
      links={links} 
      onDelete={handleDelete} 
      isRefreshing={isFetching} 
      onRefresh={handleRefresh} 
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.mutedForeground,
  },
  errorText: {
    fontSize: 16,
    color: colors.destructive,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
