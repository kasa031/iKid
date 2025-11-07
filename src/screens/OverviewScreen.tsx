/**
 * Overview Screen
 * Displays overview of all children and their status
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getAllChildren, getChildrenByParentId } from '../services/database/childService';
import { Child, UserRole, ChildStatus } from '../types';
import { Card } from '../components/common/Card';
import { Spacing, FontSizes } from '../constants/sizes';
import { getChildFullName, getStatusText, getStatusColor, formatTime } from '../utils/helpers';
import { subscribeToChildStatus } from '../services/database/checkInOutService';
import { useNavigation } from '@react-navigation/native';
import { debounce } from '../utils/optimization';

export const OverviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChildStatus | 'all'>('all');

  useEffect(() => {
    loadChildren();
  }, [user]);

  // Debounce search to avoid filtering on every keystroke
  const debouncedFilter = React.useMemo(
    () => debounce(() => filterChildren(), 300),
    [children, searchQuery, statusFilter]
  );

  useEffect(() => {
    debouncedFilter();
  }, [children, searchQuery, statusFilter, debouncedFilter]);

  const loadChildren = async () => {
    try {
      let childrenData: Child[] = [];
      if (user?.role === UserRole.PARENT) {
        childrenData = await getChildrenByParentId(user.id);
      } else {
        childrenData = await getAllChildren();
      }
      setChildren(childrenData);
      
      // Subscribe to real-time updates for each child
      childrenData.forEach((child) => {
        const unsubscribe = subscribeToChildStatus(child.id, (status) => {
          setChildren((prev) =>
            prev.map((c) =>
              c.id === child.id ? { ...c, status: status as any } : c
            )
          );
        });
        // Note: In a real app, you'd want to clean up these subscriptions
      });
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterChildren = () => {
    let filtered = [...children];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (child) =>
          child.firstName.toLowerCase().includes(query) ||
          child.lastName.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((child) => {
        const status = (child as any).status || ChildStatus.NOT_CHECKED_IN;
        return status === statusFilter;
      });
    }

    setFilteredChildren(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChildren();
  };

  const renderChildItem = ({ item }: { item: Child }) => {
    const status = (item as any).status || ChildStatus.NOT_CHECKED_IN;
    const statusColor = getStatusColor(status);
    const lastCheckIn = (item as any).lastCheckIn?.toDate?.() || null;
    const lastCheckOut = (item as any).lastCheckOut?.toDate?.() || null;

    return (
      <Card
        onPress={() => {
          if (user?.role === UserRole.STAFF) {
            (navigation as any).navigate('ChildProfile', { childId: item.id });
          }
        }}
      >
        <View style={styles.childItem}>
          <View style={styles.childInfo}>
            <Text style={[styles.childName, { color: colors.text, fontWeight: '600' }]}>
              {getChildFullName(item)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={[styles.statusText, { color: '#FFFFFF', fontWeight: '600' }]}>
                {getStatusText(status)}
              </Text>
            </View>
            {lastCheckIn && status === ChildStatus.CHECKED_IN && (
              <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: FontSizes.sm }]}>
                {t('child.checkInTime')}: {formatTime(lastCheckIn)}
              </Text>
            )}
            {lastCheckOut && status === ChildStatus.CHECKED_OUT && (
              <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: FontSizes.sm }]}>
                {t('child.checkOutTime')}: {formatTime(lastCheckOut)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('overview.title')}
      </Text>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('common.search')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Button
          title={t('overview.allChildren')}
          onPress={() => setStatusFilter('all')}
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
        <Button
          title={t('overview.present')}
          onPress={() => setStatusFilter(ChildStatus.CHECKED_IN)}
          variant={statusFilter === ChildStatus.CHECKED_IN ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
        <Button
          title={t('overview.pickedUp')}
          onPress={() => setStatusFilter(ChildStatus.CHECKED_OUT)}
          variant={statusFilter === ChildStatus.CHECKED_OUT ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
      </View>

      <FlatList
        data={filteredChildren}
        renderItem={renderChildItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Ingen barn funnet
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  childItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.lg * 1.4, // Improved line height for readability
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
    // Enhanced shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    letterSpacing: 0.3, // Improved letter spacing for clarity
  },
  loadingText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  searchContainer: {
    marginBottom: Spacing.md,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    height: 40,
    fontSize: FontSizes.md,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  filterButton: {
    flex: 1,
  },
  timeText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
});

