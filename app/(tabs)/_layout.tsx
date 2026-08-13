import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home03Icon, Time02Icon, Add02Icon, File02Icon, User02Icon } from '@/components/icons';
import { colors } from '@/lib/theme/colors';
import { Bot } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'primary-900',
        tabBarInactiveTintColor: 'primary-900',
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
      {/* <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => (
            <View className="h-14 w-14 bg-primary-900 rounded-full items-center justify-center -top-4 shadow-sm border-4 border-surface">
              <Add02Icon size={24} color="#FFFFFF" variant="solid" />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('add', { screen: 'index' });
          },
        })}
      /> */}
      <Tabs.Screen
        name="add"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Open H-bot',
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: () => (
            <View
              className="-top-4 h-14 w-14 items-center justify-center rounded-full border-4 shadow-sm"
              style={{
                backgroundColor: colors.primary[900],
                borderColor: colors.surface.DEFAULT,
              }}
            >
              <Bot
                size={27}
                color={colors.surface.DEFAULT}
                strokeWidth={2}
              />
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
    </Tabs>
  );
}
