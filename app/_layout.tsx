import '@/global.css';

import { Stack } from 'expo-router';

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen  name='index' options={{headerTitleAlign:'center' , headerTitle:'Hakeem'}} />
      </Stack>
    </>
  );
}
