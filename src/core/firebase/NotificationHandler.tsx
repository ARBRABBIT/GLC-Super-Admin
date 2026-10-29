import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {requestForToken, onMessageListener} from './firebase';
import type {RootState}
from '../../app/store/store';

import { env } from '../config/env';

const BASE_URL = env.AUTH_API_BASE_URL || 'https://eq3tqsvcw7.execute-api.ap-south-1.amazonaws.com';

const DEVICE_REGISTER_URL = `${BASE_URL}/device/register`;

const DEVICE_HEARTBEAT_URL = `${BASE_URL}/device/heartbeat`;

const HEARTBEAT_INTERVAL = 5 * 60 * 1000;

/**
 * Generates a stable device ID from the FCM token.
 * This ensures the same browser+token always produces the same device ID,
 * preventing duplicate device records on the backend.
 */
const generateDeviceId = (fcmToken: string): string => {
  const hash = fcmToken.split('').reduce((acc: number, char: string) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  const stableId = Math.abs(hash).toString(36);
  return `web_${stableId}`;
};

/**
 * Registers the device with the backend.
 */
const registerDevice = async (userId: number | string, deviceId: string, fcmToken: string, authToken: string) => {
  if (!authToken || authToken === 'undefined' || authToken === 'null') return;
  try {
    const response = await fetch(DEVICE_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        user_id: Number(userId) || userId,
        platform: 'web',
        device_id: deviceId,
        token: fcmToken,
      }),
    });

    if (response.ok) {
      console.log('[NotificationHandler] Device registered successfully.');
    } else {
      console.warn('[NotificationHandler] Device registration failed:', await response.text());
    }
  } catch (error) {
    console.error('[NotificationHandler] Device registration error:', error);
  }
};

/**
 * Sends a heartbeat to let the backend know the device is still active.
 */
const sendHeartbeat = async (userId: number | string, deviceId: string, authToken: string) => {
  if (!authToken || authToken === 'undefined' || authToken === 'null') return;
  try {
    const response = await fetch(DEVICE_HEARTBEAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        user_id: Number(userId) || userId,
        device_id: deviceId,
      }),
    });

    if (response.ok) {
      console.log('[NotificationHandler] Heartbeat sent successfully.');
    } else {
      console.warn('[NotificationHandler] Heartbeat failed:', await response.text());
    }
  } catch (error) {
    console.error('[NotificationHandler] Heartbeat error:', error);
  }
};

export const NotificationHandler: React.FC = () => {
    const { isAuthenticated, accessToken, user } = useSelector((state: RootState) => state.auth);
    const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastRegisteredKeyRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !accessToken || !user?.id || user?.role === 'MAINTENANCE') {
            lastRegisteredKeyRef.current = null;
            return;
        }

        const registrationKey = `${user.id}_${accessToken}`;
        // Prevent duplicate registration/heartbeat calls (e.g. caused by React StrictMode in development)
        if (lastRegisteredKeyRef.current === registrationKey) {
            return;
        }
        lastRegisteredKeyRef.current = registrationKey;

        const setupNotifications = async () => {
            // 1. Get FCM token
            const fcmToken = await requestForToken();
            if (!fcmToken) return;

            // 2. Get or generate a stable device ID
            let deviceId = localStorage.getItem('fcm_device_id');
            if (!deviceId) {
                deviceId = generateDeviceId(fcmToken);
                localStorage.setItem('fcm_device_id', deviceId);
                console.log('[NotificationHandler] Generated new device ID:', deviceId);
            } else {
                console.log('[NotificationHandler] Using existing device ID:', deviceId);
            }

            // 3. Register device with backend
            await registerDevice(user.id, deviceId, fcmToken, accessToken);

            // 4. Send initial heartbeat
            await sendHeartbeat(user.id, deviceId, accessToken);

            // 5. Set up periodic heartbeat (every 5 minutes)
            heartbeatIntervalRef.current = setInterval(() => {
                const currentToken = localStorage.getItem('accessToken');
                if (currentToken && currentToken !== 'undefined' && currentToken !== 'null') {
                    sendHeartbeat(user.id, deviceId!, currentToken);
                }
            }, HEARTBEAT_INTERVAL);
        };

        setupNotifications();

        // 6. Listen for foreground messages
        onMessageListener().then((payload: any) => {
            console.log('[NotificationHandler] Foreground notification:', payload);
            // TODO: Add a toast notification here (e.g. sonner, react-toastify)
        }).catch((err: any) => console.log('[NotificationHandler] Foreground listener error:', err));

        // Cleanup interval on unmount or auth change
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        };
    }, [
        isAuthenticated,
        accessToken,
        user?.id
    ]);

    return null;
};
