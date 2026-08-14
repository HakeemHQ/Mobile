import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_CODES_STORAGE_KEY = 'hakeem_access_codes';

export interface StoredAccessCode {
  oneTimeCode: string;
  codeExpiresAt: string;
}

export async function saveApprovedCode(
  requestId: string,
  oneTimeCode: string,
  codeExpiresAt: string
): Promise<void> {
  try {
    const existing = await getApprovedCodes();
    existing[requestId] = { oneTimeCode, codeExpiresAt };
    await AsyncStorage.setItem(ACCESS_CODES_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save access code locally', e);
  }
}

export async function getApprovedCodes(): Promise<Record<string, StoredAccessCode>> {
  try {
    const json = await AsyncStorage.getItem(ACCESS_CODES_STORAGE_KEY);
    if (!json) return {};
    const parsed: Record<string, StoredAccessCode> = JSON.parse(json);
    
    const now = Date.now();
    const cleaned: Record<string, StoredAccessCode> = {};
    let changed = false;

    for (const [id, data] of Object.entries(parsed)) {
      const expires = new Date(data.codeExpiresAt).getTime();
      // Remove code immediately once it becomes expired
      if (expires > now) {
        cleaned[id] = data;
      } else {
        changed = true;
      }
    }

    if (changed) {
      await AsyncStorage.setItem(ACCESS_CODES_STORAGE_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch {
    return {};
  }
}

export async function removeApprovedCode(requestId: string): Promise<void> {
  try {
    const existing = await getApprovedCodes();
    if (existing[requestId]) {
      delete existing[requestId];
      await AsyncStorage.setItem(ACCESS_CODES_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch {
  }
}
