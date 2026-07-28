import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// In AI Studio, we try to load from firebase-applet-config.json
import firebaseConfig from '../../firebase-applet-config.json' assert { type: 'json' };

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Only initialize if we have at least an apiKey
if (firebaseConfig && (firebaseConfig as any).apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

export async function submitLead(leadData: any) {
  if (!db) {
    console.warn("Firebase not initialized. Falling back to local API.");
    // Fallback to API route if Firebase client SDK isn't configured
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit via API');
    }
    
    return response.json();
  }

  return addDoc(collection(db, 'leads'), {
    ...leadData,
    status: 'new',
    createdAt: serverTimestamp()
  });
}

export async function submitContact(contactData: any) {
  if (!db) {
    console.warn("Firebase not initialized. Falling back to local contacts API.");
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...contactData,
        subject: contactData.subject || contactData.service_interest || contactData.service,
        budget: contactData.budget || "Not specified"
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit contact via API');
    }
    
    return response.json();
  }

  return addDoc(collection(db, 'contacts'), {
    ...contactData,
    createdAt: serverTimestamp()
  });
}
