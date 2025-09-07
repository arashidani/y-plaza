import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let db: FirebaseFirestore.Firestore

function initializeFirebase() {
  if (db) return db

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin env vars are not set.')
  }

  // \nを実際の改行へ
  privateKey = privateKey.replace(/\\n/g, '\n')

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey
  }

  const app = getApps()[0] ?? initializeApp({
    credential: cert(serviceAccount)
  })

  db = getFirestore(app, 'calendar')
  return db
}

export { initializeFirebase }
export { db }