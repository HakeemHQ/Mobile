import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home03Icon, Time02Icon, Add02Icon, File02Icon, User02Icon } from '@/components/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#06432E',
        tabBarInactiveTintColor: '#06432E',
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',

          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakarta-SemiBold',
          fontSize: 12, 
          marginTop: 4,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home03Icon size={24} color={color as string} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, focused }) => <Time02Icon size={24} color={color as string} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => (
            <View className="h-14 w-14 bg-secondary-900 rounded-full items-center justify-center -top-4 shadow-sm border-4 border-surface">
              <Add02Icon size={24} color="#FFFFFF" variant="solid" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="medical-cv"
        options={{
          title: 'Medical CV',
          tabBarIcon: ({ color, focused }) => <File02Icon size={24} color={color as string} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <User02Icon size={24} color={color as string} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="personal-info"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="delete-account"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
