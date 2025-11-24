/**
 * Overview Screen
 * Displays overview of all children and their status
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  getAllChildren,
  getChildrenByParentId,
} from '../services/database/childService';
import { Child, UserRole, ChildStatus } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Spacing, FontSizes } from '../constants/sizes';
import {
  getChildFullName,
  getStatusColor,
  formatTime,
} from '../utils/helpers';
import { subscribeToChildStatus } from '../services/database/checkInOutService';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../utils/optimization';
import './OverviewScreen.css';

export const OverviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChildStatus | 'all'>('all');

  // Debounce search to avoid filtering on every keystroke
  const debouncedFilter = React.useMemo(
    () => debounce(() => filterChildren(), 300),
    [children, searchQuery, statusFilter]
  );

  useEffect(() => {
    debouncedFilter();
  }, [children, searchQuery, statusFilter, debouncedFilter]);

  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

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
        childrenData.forEach(child => {
          const unsubscribe = subscribeToChildStatus(child.id, status => {
            setChildren(prev =>
              prev.map(c =>
                c.id === child.id ? { ...c, status: status as any } : c
              )
            );
          });
          unsubscribes.push(unsubscribe);
        });
      } catch (error) {
        console.error('Error loading children:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadChildren();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
      unsubscribes = [];
    };
  }, [user]);

  const filterChildren = () => {
    let filtered = [...children];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        child =>
          child.firstName.toLowerCase().includes(query) ||
          child.lastName.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(child => {
        const status = (child as any).status || ChildStatus.NOT_CHECKED_IN;
        return status === statusFilter;
      });
    }

    setFilteredChildren(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      let childrenData: Child[] = [];
      if (user?.role === UserRole.PARENT) {
        childrenData = await getChildrenByParentId(user.id);
      } else {
        childrenData = await getAllChildren();
      }
      setChildren(childrenData);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusText = (status: ChildStatus): string => {
    switch (status) {
      case ChildStatus.CHECKED_IN:
        return t('overview.present');
      case ChildStatus.CHECKED_OUT:
        return t('overview.pickedUp');
      case ChildStatus.NOT_CHECKED_IN:
        return t('overview.notDelivered');
      default:
        return t('common.error') || 'Ukjent';
    }
  };

  const renderChildItem = (item: Child) => {
    const status = (item as any).status || ChildStatus.NOT_CHECKED_IN;
    const statusColor = getStatusColor(status);
    const lastCheckIn = (item as any).lastCheckIn?.toDate?.() || null;
    const lastCheckOut = (item as any).lastCheckOut?.toDate?.() || null;

    return (
      <Card
        key={item.id}
        onPress={() => {
          if (user?.role === UserRole.STAFF) {
            navigate(`/child/${item.id}`);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                color: colors.text,
                fontWeight: 600,
                fontSize: FontSizes.lg,
                marginBottom: Spacing.sm,
                margin: 0,
              }}
            >
              {getChildFullName(item)}
            </h3>
            <div
              style={{
                backgroundColor: statusColor,
                paddingLeft: Spacing.md,
                paddingRight: Spacing.md,
                paddingTop: Spacing.sm,
                paddingBottom: Spacing.sm,
                borderRadius: 16,
                alignSelf: 'flex-start',
                marginBottom: Spacing.xs,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: FontSizes.sm,
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                {getStatusText(status)}
              </span>
            </div>
            {lastCheckIn && status === ChildStatus.CHECKED_IN && (
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: FontSizes.sm,
                  marginTop: Spacing.xs,
                  margin: 0,
                }}
              >
                {t('child.checkInTime')}: {formatTime(lastCheckIn)}
              </p>
            )}
            {lastCheckOut && status === ChildStatus.CHECKED_OUT && (
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: FontSizes.sm,
                  marginTop: Spacing.xs,
                  margin: 0,
                }}
              >
                {t('child.checkOutTime')}: {formatTime(lastCheckOut)}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const containerStyle: React.CSSProperties = {
    padding: Spacing.md,
    backgroundColor: colors.background,
    minHeight: '100vh',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
    margin: 0,
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <p
          style={{
            fontSize: FontSizes.md,
            textAlign: 'center',
            marginTop: Spacing.xl,
            color: colors.text,
          }}
        >
          {t('common.loading')}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t('overview.title')}</h1>

      <div style={{ marginBottom: Spacing.md }}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('common.search')}
          style={{ width: '100%' }}
        />
      </div>

      <div style={filterContainerStyle}>
        <Button
          title={t('overview.allChildren')}
          onPress={() => setStatusFilter('all')}
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          style={{ flex: 1 }}
        />
        <Button
          title={t('overview.present')}
          onPress={() => setStatusFilter(ChildStatus.CHECKED_IN)}
          variant={
            statusFilter === ChildStatus.CHECKED_IN ? 'primary' : 'outline'
          }
          style={{ flex: 1 }}
        />
        <Button
          title={t('overview.pickedUp')}
          onPress={() => setStatusFilter(ChildStatus.CHECKED_OUT)}
          variant={
            statusFilter === ChildStatus.CHECKED_OUT ? 'primary' : 'outline'
          }
          style={{ flex: 1 }}
        />
      </div>

      {refreshing && (
        <div style={{ textAlign: 'center', padding: Spacing.md }}>
          <span style={{ color: colors.textSecondary }}>{t('common.loading')}</span>
        </div>
      )}

      <div style={{ paddingBottom: Spacing.lg }}>
        {filteredChildren.length === 0 ? (
          <p
            style={{
              fontSize: FontSizes.md,
              textAlign: 'center',
              marginTop: Spacing.xl,
              color: colors.textSecondary,
            }}
          >
            {t('overview.noChildrenFound') || 'Ingen barn funnet'}
          </p>
        ) : (
          filteredChildren.map(item => renderChildItem(item))
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: Spacing.md }}>
        <Button
          title={refreshing ? t('common.loading') : t('common.refresh') || 'Oppdater'}
          onPress={onRefresh}
          variant="outline"
          disabled={refreshing}
        />
      </div>
    </div>
  );
};
