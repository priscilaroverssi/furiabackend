import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };

