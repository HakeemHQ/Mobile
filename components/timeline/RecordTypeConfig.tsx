/**
 * RecordTypeConfig
 * Centralized mapping from MedicalRecordType → visual properties.
 * Used by both the timeline list and the record detail page for consistency.
 */
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  PillIcon,
  FlaskConicalIcon,
  Stethoscope02Icon,
  Scissor01Icon,
  Hospital02Icon,
  UserIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { colors } from '@/lib/theme';
import type { MedicalRecordType } from '@/types/medical-record';
import type { TimelineNodeType } from './TimelineItemNode';
import type { TagVariant } from './TimelineCard';

export interface RecordTypeVisualConfig {
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  nodeType: TimelineNodeType;
  tagVariant: TagVariant;
  /** i18n key under 'timeline:recordTypes' */
  labelKey: string;
  /** i18n key under 'timeline:filters' */
  filterKey: string;
}

/**
 * Visual configuration for each of the 8 medical record types.
 */
export const RECORD_TYPE_CONFIG: Record<MedicalRecordType, RecordTypeVisualConfig> = {
  Medication: {
    icon: <HugeiconsIcon icon={PillIcon} size={24} color={colors.primary.DEFAULT} />,
    iconColor: colors.primary.DEFAULT,
    bgColor: 'bg-primary-50',
    nodeType: 'medication',
    tagVariant: 'medication',
    labelKey: 'Medication',
    filterKey: 'Medication',
  },
  LabResult: {
    icon: <HugeiconsIcon icon={FlaskConicalIcon} size={24} color={colors.tertiary.DEFAULT} />,
    iconColor: colors.tertiary.DEFAULT,
    bgColor: 'bg-tertiary-50',
    nodeType: 'lab',
    tagVariant: 'labs',
    labelKey: 'LabResult',
    filterKey: 'LabResult',
  },
  Condition: {
    icon: <HugeiconsIcon icon={Stethoscope02Icon} size={24} color={colors.secondary.DEFAULT} />,
    iconColor: colors.secondary.DEFAULT,
    bgColor: 'bg-secondary-50',
    nodeType: 'visit',
    tagVariant: 'visits',
    labelKey: 'Condition',
    filterKey: 'Condition',
  },
  Allergy: {
    icon: <HugeiconsIcon icon={AlertCircleIcon} size={24} color={colors.danger.DEFAULT} />,
    iconColor: colors.danger.DEFAULT,
    bgColor: 'bg-danger-50',
    nodeType: 'default',
    tagVariant: 'default',
    labelKey: 'Allergy',
    filterKey: 'Allergy',
  },
  Procedure: {
    icon: <HugeiconsIcon icon={Scissor01Icon} size={24} color={colors.tertiary.DEFAULT} />,
    iconColor: colors.tertiary.DEFAULT,
    bgColor: 'bg-tertiary-50',
    nodeType: 'scan',
    tagVariant: 'labs',
    labelKey: 'Procedure',
    filterKey: 'Procedure',
  },
  Visit: {
    icon: <HugeiconsIcon icon={Stethoscope02Icon} size={24} color={colors.secondary.DEFAULT} />,
    iconColor: colors.secondary.DEFAULT,
    bgColor: 'bg-secondary-50',
    nodeType: 'visit',
    tagVariant: 'visits',
    labelKey: 'Visit',
    filterKey: 'Visit',
  },
  Facility: {
    icon: <HugeiconsIcon icon={Hospital02Icon} size={24} color={colors.primary[700]} />,
    iconColor: colors.primary[700],
    bgColor: 'bg-primary-50',
    nodeType: 'default',
    tagVariant: 'default',
    labelKey: 'Facility',
    filterKey: 'Facility',
  },
  PatientInformation: {
    icon: <HugeiconsIcon icon={UserIcon} size={24} color={colors.primary[700]} />,
    iconColor: colors.primary[700],
    bgColor: 'bg-primary-50',
    nodeType: 'default',
    tagVariant: 'default',
    labelKey: 'PatientInformation',
    filterKey: 'PatientInformation',
  },
};

/**
 * Get visual config for a record type, with fallback for unknown types.
 */
export const getRecordTypeConfig = (recordType: string): RecordTypeVisualConfig => {
  return (
    RECORD_TYPE_CONFIG[recordType as MedicalRecordType] ||
    RECORD_TYPE_CONFIG.Medication
  );
};

/**
 * Parse the displayName string to extract the primary name and subtitle.
 *
 * Example input:
 *   "MedicationName: Amoxicillin, Dose: 500 mg, Quantity: 1 capsule, Route: Oral, Frequency: every 8 hours"
 *
 * Returns:
 *   { primaryName: "Amoxicillin", subtitle: "500 mg · Oral · every 8 hours" }
 */
export const parseDisplayName = (
  displayName: string,
  recordType: string
): { primaryName: string; subtitle: string } => {
  // Define which field key represents the "primary name" for each record type
  const primaryFieldMap: Record<string, string> = {
    Medication: 'MedicationName',
    LabResult: 'LabTestName',
    Condition: 'ConditionName',
    Allergy: 'AllergyName',
    Procedure: 'ProcedureName',
    Visit: 'DoctorName',
    Facility: 'FacilityName',
    PatientInformation: 'PatientName',
  };

  const primaryFieldKey = primaryFieldMap[recordType] || '';

  // Parse "Key: Value, Key: Value" format
  const parts = displayName.split(',').map((s) => s.trim());
  let primaryName = '';
  const otherValues: string[] = [];

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex === -1) {
      otherValues.push(part);
      continue;
    }

    const key = part.substring(0, colonIndex).trim();
    const value = part.substring(colonIndex + 1).trim();

    if (key === primaryFieldKey) {
      primaryName = value;
    } else {
      otherValues.push(value);
    }
  }

  // If no primary name found, use the first part or the full displayName
  if (!primaryName) {
    primaryName = otherValues.shift() || displayName;
  }

  return {
    primaryName,
    subtitle: otherValues.join(' · '),
  };
};
