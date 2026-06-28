// Firebase Configuration — उन्नति स्वयं सहायता समिति
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Formspree endpoint (fallback & ID Card forms)
const FORMSPREE_IDCARD    = "https://formspree.io/f/xdkgnpqv";  // ID Card form
const FORMSPREE_DAILY     = "https://formspree.io/f/xdkgnpqv";  // Daily report
const FORMSPREE_STUDENT   = "https://formspree.io/f/xdkgnpqv";  // Student registration
const FORMSPREE_APPOINTMENT = "https://formspree.io/f/xdkgnpqv"; // Appointment

// WhatsApp number for notifications
const WHATSAPP_NUMBER = "919410332400";

// Payment page
const PAYMENT_URL = "https://unnatiselfhelpgroup-creator.github.io/appointment-payment.html";
const RAZORPAY_URL = "https://razorpay.me/@wwwunnatiselfhelpgroupcom";

// ---- Firebase Init (safe) ----
let db = null;
let firebaseReady = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      firebaseReady = true;
      console.log("✅ Firebase connected");
    } else {
      console.warn("⚠️ Firebase not configured — using Formspree fallback");
    }
  } catch(e) {
    console.warn("Firebase init error:", e);
  }
}

// ---- Save to Firebase OR Formspree fallback ----
async function saveData(collection, data, formspreeUrl) {
  // Try Firebase first
  if (firebaseReady && db) {
    try {
      await db.collection(collection).add({ ...data, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      return { success: true, method: 'firebase' };
    } catch(e) {
      console.warn("Firebase save failed, trying Formspree...", e);
    }
  }
  // Formspree fallback
  try {
    const res = await fetch(formspreeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.ok) return { success: true, method: 'formspree' };
    throw new Error(json.error || 'Formspree error');
  } catch(e) {
    // Last resort — WhatsApp
    const msg = encodeURIComponent("📋 नया आवेदन:\n" + Object.entries(data).map(([k,v]) => `${k}: ${v}`).join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    return { success: true, method: 'whatsapp' };
  }
}
