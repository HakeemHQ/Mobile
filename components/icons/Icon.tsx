import React from 'react';
import { IconName, IconProps } from './types';
import { AddIcon } from './AddIcon';
import { AlertIcon } from './AlertIcon';
import { AlertSquareIcon } from './AlertSquareIcon';
import { ArrowLeft01Icon } from './ArrowLeft01Icon';
import { ArrowLeft02Icon } from './ArrowLeft02Icon';
import { ArrowLeftBigIcon } from './ArrowLeftBigIcon';
import { ArrowRightIcon } from './ArrowRightIcon';
import { ArrowRightBigIcon } from './ArrowRightBigIcon';
import { CalendarIcon } from './CalendarIcon';
import { CallIcon } from './CallIcon';
import { CheckmarkCircleIcon } from './CheckmarkCircleIcon';
import { ContainerIcon } from './ContainerIcon';
import { DeleteIcon } from './DeleteIcon';
import { EyeOffIcon } from './EyeOffIcon';
import { FileIcon } from './FileIcon';
import { FilesIcon } from './FilesIcon';
import { HomeIcon } from './HomeIcon';
import { LockOpenIcon } from './LockOpenIcon';
import { MailIcon } from './MailIcon';
import { NotificationIcon } from './NotificationIcon';
import { SecurityCheckIcon } from './SecurityCheckIcon';
import { ShieldIcon } from './ShieldIcon';
import { StethoscopeIcon } from './StethoscopeIcon';
import { TimeIcon } from './TimeIcon';
import { UserIcon } from './UserIcon';
import { ViewIcon } from './ViewIcon';

export interface DynamicIconProps extends IconProps {
  name: IconName;
}

export const iconMap: Record<IconName, React.ComponentType<IconProps>> = {
  add: AddIcon,
  'add-02': AddIcon,
  alert: AlertIcon,
  'alert-01': AlertIcon,
  'alert-square': AlertSquareIcon,
  'arrow-left-01': ArrowLeft01Icon,
  'arrow-left-02': ArrowLeft02Icon,
  'arrow-left-big': ArrowLeftBigIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-right-01': ArrowRightIcon,
  'arrow-right-big': ArrowRightBigIcon,
  calendar: CalendarIcon,
  'calendar-03': CalendarIcon,
  call: CallIcon,
  'call-02': CallIcon,
  'checkmark-circle': CheckmarkCircleIcon,
  'checkmark-circle-01': CheckmarkCircleIcon,
  container: ContainerIcon,
  delete: DeleteIcon,
  'delete-02': DeleteIcon,
  'eye-off': EyeOffIcon,
  file: FileIcon,
  'file-02': FileIcon,
  files: FilesIcon,
  'files-01': FilesIcon,
  home: HomeIcon,
  'home-03': HomeIcon,
  'lock-open': LockOpenIcon,
  mail: MailIcon,
  'mail-01': MailIcon,
  notification: NotificationIcon,
  'notification-01': NotificationIcon,
  'security-check': SecurityCheckIcon,
  shield: ShieldIcon,
  stethoscope: StethoscopeIcon,
  'stethoscope-02': StethoscopeIcon,
  time: TimeIcon,
  'time-02': TimeIcon,
  user: UserIcon,
  'user-02': UserIcon,
  view: ViewIcon,
};

export function Icon({ name, ...props }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon library.`);
    return null;
  }
  return <IconComponent {...props} />;
}
