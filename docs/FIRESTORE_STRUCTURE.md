# Firestore Database Structure

This document outlines the structure of the Firestore database for the AI Doctor platform, including collections, documents, and security rules.

## Collections

### 1. `ai-agents`
Stores information about AI agents created by providers.

**Document Fields:**
```typescript
{
  id: string;                    // Auto-generated document ID
  providerId: string;           // ID of the provider who owns this agent
  name: string;                 // Display name of the agent
  specialty: string;            // Medical specialty (e.g., "Cardiology", "General Practice")
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  avatar?: string;              // URL to agent's avatar image
  description: string;          // Detailed description of the agent
  consultations: number;        // Total number of consultations
  rating: number;               // Average rating (0-5)
  responseTime: number;         // Average response time in seconds
  successRate: number;          // Percentage of successful consultations
  revenue: number;              // Total revenue generated
  isPublic: boolean;            // Whether the agent is publicly visible
  settings: {                   // Agent-specific settings
    maxConsultations: number;
    workingHours: string;
    languages: string[];
    autoRespond: boolean;
    consultationPrice: number;
    specializations: string[];
    availabilityStatus: 'available' | 'busy' | 'offline';
    responseDelay: number;
    maxSessionDuration: number;
  };
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
  lastActive: string;           // ISO timestamp
  deletedAt?: string;           // ISO timestamp (for soft deletes)
}
```

### 2. `consultations`
Stores consultation records between patients and AI agents.

**Document Fields:**
```typescript
{
  id: string;                    // Auto-generated document ID
  providerId: string;           // ID of the provider
  agentId: string;              // ID of the AI agent
  patientId: string;            // ID of the patient
  patientName: string;          // Patient's display name
  agentName: string;            // Agent's display name
  startTime: string;            // ISO timestamp
  endTime?: string;             // ISO timestamp (set when consultation ends)
  duration?: number;            // Duration in minutes (calculated)
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  rating?: number;              // 1-5 rating from patient
  revenue: number;              // Revenue generated from this consultation
  symptoms: string[];           // Reported symptoms
  diagnosis?: string;           // AI-generated diagnosis
  prescriptions: Array<{        // Prescriptions if any
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    instructions: string;
  }>;
  notes?: string;               // Additional notes
  sessionType: 'text' | 'voice' | 'video';
  followUpRequired: boolean;
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
  cancelledAt?: string;         // ISO timestamp (if cancelled)
}
```

### 3. `api-keys`
Manages API keys for programmatic access.

**Document Fields:**
```typescript
{
  id: string;                    // Auto-generated document ID
  providerId: string;           // ID of the provider who owns this key
  name: string;                 // User-defined name for the key
  prefix: string;               // First 8 characters of the key
  keyHash: string;              // Hashed version of the full key
  keySuffix: string;            // Last 4 characters of the key (for display)
  permissions: string[];        // Array of permissions (e.g., ["read:agents", "write:consultations"])
  createdAt: string;            // ISO timestamp
  expiresAt: string;            // ISO timestamp
  lastUsed?: string;            // ISO timestamp
  revoked: boolean;             // Whether the key has been revoked
  revokedAt?: string;           // ISO timestamp (if revoked)
}
```

### 4. `provider-settings`
Stores provider-specific settings and preferences.

**Document Fields:**
```typescript
{
  id: string;                    // Same as providerId
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoAcceptConsultations: boolean;
  performanceAnalytics: boolean;
  dataSharing: boolean;
  workingHours: {
    monday: { isActive: boolean; startTime: string; endTime: string; };
    tuesday: { isActive: boolean; startTime: string; endTime: string; };
    wednesday: { isActive: boolean; startTime: string; endTime: string; };
    thursday: { isActive: boolean; startTime: string; endTime: string; };
    friday: { isActive: boolean; startTime: string; endTime: string; };
    saturday: { isActive: boolean; startTime: string; endTime: string; };
    sunday: { isActive: boolean; startTime: string; endTime: string; };
    timezone: string;
  };
  paymentSettings: {
    paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'crypto';
    paymentFrequency: 'weekly' | 'monthly' | 'quarterly';
    minimumPayout: number;
    taxInformation: {
      taxId: string;
      businessType: 'individual' | 'business';
      country: string;
      state?: string;
      vatNumber?: string;
    };
  };
  privacySettings: {
    sharePerformanceData: boolean;
    allowDataAnalytics: boolean;
    sharePatientInsights: boolean;
    marketingCommunications: boolean;
  };
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
}
```

## Security Rules

Security rules are defined in `firestore.rules` and enforce the following:

1. **Authentication Required**: All operations require authentication.
2. **Data Ownership**: Users can only access their own data.
3. **Role-Based Access**: Different operations are allowed based on user roles.
4. **Validation**: Data is validated before being written to the database.
5. **Soft Deletes**: Records are marked as deleted rather than being removed.

## Indexes

The following composite indexes should be created in Firestore:

1. `ai-agents` collection:
   - `providerId` Ascending, `status` Ascending
   - `status` Ascending, `createdAt` Descending

2. `consultations` collection:
   - `providerId` Ascending, `startTime` Descending
   - `agentId` Ascending, `startTime` Descending
   - `patientId` Ascending, `startTime` Descending
   - `status` Ascending, `startTime` Descending

3. `api-keys` collection:
   - `providerId` Ascending, `revoked` Ascending
   - `expiresAt` Ascending

## Best Practices

1. **Data Validation**: Always validate data before writing to Firestore.
2. **Security Rules**: Keep security rules up to date with any schema changes.
3. **Index Management**: Monitor query performance and add indexes as needed.
4. **Backup**: Regularly back up your Firestore data.
5. **Monitoring**: Set up monitoring for security rule denials and performance issues.

## Example Queries

### Get active agents for a provider
```typescript
const activeAgents = await db.collection('ai-agents')
  .where('providerId', '==', providerId)
  .where('status', '==', 'active')
  .orderBy('createdAt', 'desc')
  .get();
```

### Get recent consultations for an agent
```typescript
const recentConsultations = await db.collection('consultations')
  .where('agentId', '==', agentId)
  .orderBy('startTime', 'desc')
  .limit(10)
  .get();
```

### Get provider settings with defaults
```typescript
const settingsDoc = await db.collection('provider-settings')
  .doc(providerId)
  .get();

const settings = settingsDoc.exists 
  ? settingsDoc.data() 
  : getDefaultSettings(providerId);
```
