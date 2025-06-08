require("dotenv").config();
const admin = require("firebase-admin");

// For development environment, make Firebase optional
const isDev = process.env.NODE_ENV === "development";
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

// Use mock DB for development if Firebase credentials aren't available
if (!serviceAccountPath) {
  console.warn(
    "WARNING: FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set"
  );

  if (isDev) {
    console.log("Running in development mode with mock database");
    // Mock Firestore for development
    const mockDb = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
        }),
      }),
    };
    module.exports = mockDb;
  } else {
    console.error("Firebase credentials required in production mode");
    process.exit(1);
  }
} else {
  try {
    // Use absolute path for more reliable loading
    const path = require("path");
    const resolvedPath = path.resolve(serviceAccountPath);
    console.log(
      `Attempting to load Firebase credentials from: ${resolvedPath}`
    );

    const serviceAccount = require(resolvedPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();
    console.log("Firebase initialized successfully");
    module.exports = db;
  } catch (error) {
    console.error("Error initializing Firebase:");
    console.error(`  - Path: ${serviceAccountPath}`);
    console.error(`  - Error: ${error.message}`);

    if (isDev) {
      console.log("Continuing in development mode with mock database");
      // Mock Firestore for development
      const mockDb = {
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: false, data: () => ({}) }),
            set: async () => ({}),
            update: async () => ({}),
            delete: async () => ({}),
          }),
        }),
      };
      module.exports = mockDb;
    } else {
      process.exit(1);
    }
  }
}
