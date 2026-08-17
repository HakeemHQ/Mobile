import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, XCircle, MinusCircle } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import type { AccessRequestItem } from '@/lib/api/access-requests';

export interface AccessRequestCardProps {
  item: AccessRequestItem;
  isRTL: boolean;
  now: number;
  isProcessing: boolean;
  isLast?: boolean;
  onApprove: (requestId: string, doctorName: string) => void;
  onReject: (requestId: string) => void;
  onRevoke?: (requestId: string) => void;
}

const getNodeConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        nodeBg: '#FEF3C7',
        Icon: Clock,
        iconColor: '#D97706',
        badgeBg: '#FFFBEB',
        badgeText: '#B45309',
        badgeBorder: '#FDE68A',
      };
    case 'active':
    case 'approved':
      return {
        nodeBg: '#D1FAE5',
        Icon: CheckCircle2,
        iconColor: '#059669',
        badgeBg: '#ECFDF5',
        badgeText: '#047857',
        badgeBorder: '#A7F3D0',
      };
    case 'revoked':
    case 'rejected':
      return {
        nodeBg: '#FFE4E6',
        Icon: XCircle,
        iconColor: '#E11D48',
        badgeBg: '#FFF1F2',
        badgeText: '#BE123C',
        badgeBorder: '#FECDD3',
      };
    case 'expired':
    case 'redeemed':
    default:
      return {
        nodeBg: '#F1F5F9',
        Icon: MinusCircle,
        iconColor: '#475569',
        badgeBg: '#F8FAFC',
        badgeText: '#475569',
        badgeBorder: '#E2E8F0',
      };
  }
};

export const AccessRequestCard: React.FC<AccessRequestCardProps> = ({
  item,
  isRTL,
  now,
  isProcessing,
  isLast = false,
  onApprove,
  onReject,
  onRevoke,
}) => {
  const { t } = useTranslation('accessRequests');
  const statusLower = (item.status || '').toLowerCase();
  const isPending = statusLower === 'pending';
  const canRevoke = statusLower === 'redeemed';

  const expiresTime = item.codeExpiresAt ? new Date(item.codeExpiresAt).getTime() : null;
  const isExpired = expiresTime ? expiresTime < now : false;

  // Countdown
  let remainingText = '';
  if (expiresTime && !isExpired) {
    const diffMs = expiresTime - now;
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    remainingText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const nodeConfig = getNodeConfig(statusLower);
  const NodeIcon = nodeConfig.Icon;

  // Format date under card (like timeline)
  const formattedDate = new Date(item.requestedAt).toLocaleDateString(
    isRTL ? 'ar-EG' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  const statusLabel = t(`statuses.${statusLower}`, { defaultValue: item.status });

  return (
    <View className={cn('flex-row items-start mb-1', isRTL && 'flex-row-reverse')}>
      {/* ── Left Vertical Track ── */}
      <View className={cn('items-center self-stretch', isRTL ? 'ml-3.5' : 'mr-3.5')}>
        {/* Node Circle Icon */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center z-10"
          style={{ backgroundColor: nodeConfig.nodeBg }}
        >
          <NodeIcon size={20} color={nodeConfig.iconColor} strokeWidth={2} />
        </View>

        {/* Vertical Line Connector */}
        {!isLast ? (
          <View className="w-[2px] bg-gray-300 flex-1 my-1" />
        ) : null}
      </View>

      {/* ── Right Content Section ── */}
      <View className="flex-1 pb-4">
        {/* Card */}
        <View className="bg-white rounded-[16px] p-4 border border-[#C2C7D1] shadow-sm">
          {/* Doctor Info Row */}
          <View className={cn('flex-row items-center justify-between gap-2', isRTL && 'flex-row-reverse')}>
            <View className={cn('flex-1', isRTL && 'items-end')}>
              <Text
                className={cn('text-[15px] font-jakarta-bold text-gray-900 leading-5', isRTL && 'text-right')}
                numberOfLines={2}
              >
                {item.doctor?.fullName || t('unknownDoctor', 'Unknown Doctor')}
              </Text>
              <Text className={cn('text-[13px] font-inter-medium text-gray-500 mt-0.5', isRTL && 'text-right')}>
                {item.doctor?.specialty || t('generalSpecialty', 'General')}
              </Text>
            </View>

            {/* Status badge */}
            <View
              className="px-2.5 py-1 rounded-full"
              style={{ backgroundColor: nodeConfig.badgeBg, borderWidth: 1, borderColor: nodeConfig.badgeBorder }}
            >
              <Text
                className="text-[11px] font-jakarta-bold capitalize"
                style={{ color: nodeConfig.badgeText }}
              >
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* One Time Code Section */}
          {item.oneTimeCode ? (
            <>
              <View className="h-[1px] bg-gray-200 my-3" />
              <View className={cn('flex-row items-center justify-between', isRTL && 'flex-row-reverse')}>
                <View className={cn('flex-row items-center gap-1.5', isRTL && 'flex-row-reverse')}>
                  <Text className={cn('text-[12px] font-inter-medium text-gray-500', isRTL && 'text-right')}>
                    {t('accessCode', 'Access Code')}
                  </Text>
                  {!isExpired && remainingText ? (
                    <Text
                      className="text-[11px] font-jakarta-semibold"
                      style={{ color: '#059669' }}
                    >
                      ({remainingText})
                    </Text>
                  ) : null}
                </View>

                <View className={cn('flex-row items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <Text
                    className={cn('text-[16px] font-jakarta-bold tracking-widest')}
                    style={{ color: isExpired ? '#9CA3AF' : '#1E3A5F', textDecorationLine: isExpired ? 'line-through' : 'none' }}
                  >
                    {item.oneTimeCode}
                  </Text>
                  {isExpired && (
                    <Text className="text-[10px] font-jakarta-semibold" style={{ color: '#E11D48' }}>
                      {t('expiredTag', 'Expired')}
                    </Text>
                  )}
                </View>
              </View>
            </>
          ) : null}

          {/* Action Buttons for Pending */}
          {isPending && (
            <>
              <View className="h-[1px] bg-gray-200 my-3" />
              <View className={cn('flex-row gap-2', isRTL && 'flex-row-reverse')}>
                <Pressable
                  onPress={() => onReject(item.requestId)}
                  disabled={isProcessing}
                  className={cn(
                    'flex-1 py-2 rounded-full items-center justify-center',
                    isProcessing && 'opacity-50'
                  )}
                  style={{ backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' }}
                >
                  <Text className="text-[13px] font-jakarta-semibold" style={{ color: '#E11D48' }}>
                    {t('reject', 'Reject')}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onApprove(item.requestId, item.doctor?.fullName)}
                  disabled={isProcessing}
                  className={cn(
                    'flex-1 py-2 rounded-full items-center justify-center',
                    isProcessing && 'opacity-50'
                  )}
                  style={{ backgroundColor: '#059669' }}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text className="text-[13px] font-jakarta-semibold" style={{ color: '#FFFFFF' }}>
                      {t('approve', 'Approve')}
                    </Text>
                  )}
                </Pressable>
              </View>
            </>
          )}

          {/* Action Buttons for Redeemed */}
          {canRevoke && onRevoke && (
            <>
              <View className="h-[1px] bg-gray-200 my-3" />
              <View className={cn('flex-row gap-2', isRTL && 'flex-row-reverse')}>
                <Pressable
                  onPress={() => onRevoke(item.requestId)}
                  disabled={isProcessing}
                  className={cn(
                    'flex-1 py-2 rounded-full items-center justify-center',
                    isProcessing && 'opacity-50'
                  )}
                  style={{ backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' }}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#E11D48" />
                  ) : (
                    <Text className="text-[13px] font-jakarta-semibold" style={{ color: '#E11D48' }}>
                      {t('revokeAccess', 'Revoke Access')}
                    </Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Date label UNDER card (like Timeline) */}
        <Text className={cn('text-[14px] font-jakarta-bold text-gray-900 mt-2.5 mb-1', isRTL && 'text-right')}>
          {formattedDate}
        </Text>
      </View>
    </View>
  );
};
