// firebase.ts
import admin, { ServiceAccount } from 'firebase-admin';

import serviceAccountKey from '../firebase/serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as ServiceAccount)
});

export default admin;
