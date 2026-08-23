export type ReminderType =
    | 'MEDICATION'
    | 'APPOINTMENT'
    | 'LAB_TEST';

export type ReminderDeliveryMode =
    | 'NOTIFICATION'
    | 'ALARM';

export type MedicationDurationType =
    | 'LIFELONG'
    | 'FINITE';

export type MedicationFrequencyType =
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY';

export type MedicationWeekdayCode =
    | 'SUN'
    | 'MON'
    | 'TUE'
    | 'WED'
    | 'THU'
    | 'FRI'
    | 'SAT';

export type MedicationMealRelation =
    | 'BEFORE'
    | 'AFTER';

export type MedicationMealName =
    | 'Breakfast'
    | 'Lunch'
    | 'Dinner'
    | 'Snack';

export interface DeviceUser {
    userId: string;
    email: string;
    createdAt: string;
    lastLoggedInAt: string;
}

export interface ReminderSchedule {
    scheduleId: string;
    reminderId: string;
    doseSequence: number;
    localTime: string;
    triggerAtUtc: string | null;
    deliveryMode: ReminderDeliveryMode;
    nativeAlarmId?: number | null;
    createdAt: string;
}

interface ReminderBase {
    reminderId: string;
    ownerUserId: string;
    title: string;
    isEnabled: boolean;
    createdAt: string;
    schedules: ReminderSchedule[];
}

export interface MedicationReminder
    extends ReminderBase {
    reminderType: 'MEDICATION';
    dosage: string | null;
    instructions: string | null;
    durationType: MedicationDurationType;
    startDate: string;
    endDate: string | null;
    frequencyType: MedicationFrequencyType;
    weekdays: MedicationWeekdayCode[];
    monthDays: number[];
    mealRelation: MedicationMealRelation | null;
    mealName: MedicationMealName | null;
}

export interface AppointmentReminder
    extends ReminderBase {
    reminderType: 'APPOINTMENT';
    appointmentDate: string;
    providerName: string | null;
}

export interface LabTestReminder
    extends ReminderBase {
    reminderType: 'LAB_TEST';
    dueDate: string;
    labName: string | null;
}

export type Reminder =
    | MedicationReminder
    | AppointmentReminder
    | LabTestReminder;

export interface ReminderScheduleInput {
    doseSequence?: number;
    localTime: string;
    triggerAtUtc?: string | null;
    deliveryMode?: ReminderDeliveryMode;
    nativeAlarmId?: number | null;
}

interface CreateReminderBaseInput {
    ownerUserId: string;
    title: string;
    isEnabled?: boolean;
    schedules: ReminderScheduleInput[];
}

export interface CreateMedicationReminderInput
    extends CreateReminderBaseInput {
    reminderType: 'MEDICATION';
    dosage?: string | null;
    instructions?: string | null;
    durationType: MedicationDurationType;
    startDate: string;
    endDate?: string | null;
    frequencyType: MedicationFrequencyType;
    weekdays?: MedicationWeekdayCode[];
    monthDays?: number[];
    mealRelation?: MedicationMealRelation | null;
    mealName?: MedicationMealName | null;
}

export interface CreateAppointmentReminderInput
    extends CreateReminderBaseInput {
    reminderType: 'APPOINTMENT';
    appointmentDate: string;
    providerName?: string | null;
}

export interface CreateLabTestReminderInput
    extends CreateReminderBaseInput {
    reminderType: 'LAB_TEST';
    dueDate: string;
    labName?: string | null;
}

export type CreateReminderInput =
    | CreateMedicationReminderInput
    | CreateAppointmentReminderInput
    | CreateLabTestReminderInput;

export type CreateMedicationReminderFormInput =
    Omit<
        CreateMedicationReminderInput,
        'ownerUserId'
    >;

export type CreateAppointmentReminderFormInput =
    Omit<
        CreateAppointmentReminderInput,
        'ownerUserId'
    >;

export type CreateLabTestReminderFormInput =
    Omit<
        CreateLabTestReminderInput,
        'ownerUserId'
    >;

export interface MedicationDraftInput {
    title: string;
    dosage: string | null;
    instructions: string | null;
    durationType: MedicationDurationType;
    startDate: string;
    endDate: string | null;
    frequencyType: MedicationFrequencyType;
    weekdays: MedicationWeekdayCode[];
    monthDays: number[];
    timesPerDay: number;
    firstDoseTime: string;
    mealRelation: MedicationMealRelation | null;
    mealName: MedicationMealName | null;
}

export interface MedicationDraft
    extends MedicationDraftInput {
    draftId: string;
    createdAt: string;
    schedules: ReminderScheduleInput[];
}

export interface SavedMedicationSummary {
    draftId: string;
    title: string;
    scheduleCount: number;
    frequencyType: MedicationFrequencyType;
}

export interface UpdateReminderInput {
    reminderId: string;
    title?: string;
    isEnabled?: boolean;
    schedules?: ReminderScheduleInput[];
    medication?: {
        dosage?: string | null;
        instructions?: string | null;
        durationType?: MedicationDurationType;
        startDate?: string;
        endDate?: string | null;
        frequencyType?: MedicationFrequencyType;
        weekdays?: MedicationWeekdayCode[];
        monthDays?: number[];
        mealRelation?: MedicationMealRelation | null;
        mealName?: MedicationMealName | null;
    };
    appointment?: {
        appointmentDate?: string;
        providerName?: string | null;
    };
    labTest?: {
        dueDate?: string;
        labName?: string | null;
    };
}

export type ReminderLoadStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'error';
