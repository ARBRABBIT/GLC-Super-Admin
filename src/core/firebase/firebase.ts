// firebase.ts

import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage, isSupported} from "firebase/messaging";
import type {Messaging} from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ─── Guard messaging init — avoid crash in unsupported browsers ──────────────
let messaging: Messaging | null = null;

const initMessaging = async (): Promise<Messaging | null> => {
    try {
        const supported = await isSupported();
        if (supported) {
            messaging = getMessaging(app);
        } else {
            console.warn("[Firebase] Messaging is not supported in this browser.");
        }
    } catch (err) {
        console.warn("[Firebase] Failed to initialize messaging:", err);
    }
    return messaging;
};

// Kick off async init (non-blocking)
const messagingPromise = initMessaging();

export { messaging, messagingPromise };

export const requestForToken = async () => {
    try {
        const msg = await messagingPromise;
        if (!msg) return null;

        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

            await navigator.serviceWorker.ready;

            const currentToken = await getToken(msg, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (currentToken) {
                console.log("FCM Token:", currentToken);
                return currentToken;
            } else {
                console.log("No registration token available.");
            }
        }
    } catch (err) {
        console.log("Error while retrieving token:", err);
    }
};

export const onMessageListener = () => new Promise((resolve) => {
    messagingPromise.then((msg) => {
        if (msg) {
            onMessage(msg, (payload) => {
                console.log("Foreground Message received:", payload);
                resolve(payload);
            });
        }
    });
});

export default app;
