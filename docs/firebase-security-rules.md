# Firebase Security Rules

Cloud Sync v1 stores each user's learning record in:

```text
userStates/{uid}
```

Recommended Firestore Security Rules:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /userStates/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

These rules must be deployed manually in the Firebase Console:

1. Open Firebase Console.
2. Select the project used by Nihongo Studio.
3. Open Firestore Database -> Rules.
4. Paste the rules above.
5. Publish the rules.

Important notes:

- Do not treat Cloud Sync as secure until these Firestore Rules are correctly deployed.
- The Firebase Web config values in `.env.local` are not Firebase Admin SDK credentials and are expected to be present in a browser app.
- Never put a Firebase Admin SDK, service account JSON, private key, or server secret in this repository or in frontend code.
- GitHub Pages only hosts static files. Firestore access control is enforced by Firebase Authentication and Firestore Security Rules.
- Cloud Sync uploads only the user's `learningState`; course unit text and lesson content are not uploaded.
