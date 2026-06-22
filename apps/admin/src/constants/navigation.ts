import {
  LayoutDashboard,
  Users,
  Heart,
  Tag,
  Bell,
  HeadphonesIcon,
  Settings,
  Shield,
  ScrollText,
  Flag,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  permissions?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', href: '/dashboard/users', icon: Users, permissions: ['read:users'] },
      { label: 'Donations', href: '/dashboard/donations', icon: Heart, permissions: ['read:donations'] },
      { label: 'Categories', href: '/dashboard/categories', icon: Tag, permissions: ['read:categories'] },
    ],
  },
  {
    title: 'Moderation',
    items: [
      { label: 'Reports', href: '/dashboard/reports', icon: Flag, badge: 3, permissions: ['read:reports'] },
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, permissions: ['read:notifications'] },
      { label: 'Support', href: '/dashboard/support', icon: HeadphonesIcon, badge: 5, permissions: ['read:support'] },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, permissions: ['read:settings'] },
      { label: 'Roles', href: '/dashboard/roles', icon: Shield, permissions: ['read:roles'] },
      { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: ScrollText, permissions: ['read:audit'] },
    ],
  },
];
