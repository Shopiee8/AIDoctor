import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import adminApp, { adminDb } from '@/lib/firebase-admin';

// GET /api/ai-provider/settings - Get provider settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    const doc = await adminDb.collection('provider-settings').doc(providerId).get();
    
    if (!doc.exists) {
      // Return default settings if not found
      return NextResponse.json({
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptConsultations: false,
        performanceAnalytics: true,
        dataSharing: false,
        workingHours: {
          monday: { isActive: true, startTime: '09:00', endTime: '17:00' },
          tuesday: { isActive: true, startTime: '09:00', endTime: '17:00' },
          wednesday: { isActive: true, startTime: '09:00', endTime: '17:00' },
          thursday: { isActive: true, startTime: '09:00', endTime: '17:00' },
          friday: { isActive: true, startTime: '09:00', endTime: '17:00' },
          saturday: { isActive: false, startTime: '10:00', endTime: '14:00' },
          sunday: { isActive: false, startTime: '10:00', endTime: '14:00' },
          timezone: 'UTC'
        },
        paymentSettings: {
          paymentMethod: 'bank_transfer',
          paymentFrequency: 'monthly',
          minimumPayout: 100,
          taxInformation: {}
        },
        privacySettings: {
          sharePerformanceData: true,
          allowDataAnalytics: true,
          sharePatientInsights: false,
          marketingCommunications: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching provider settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider settings' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-provider/settings - Update provider settings
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { providerId, ...settings } = data;
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    const settingsRef = adminDb.collection('provider-settings').doc(providerId);
    
    // Check if settings exist
    const doc = await settingsRef.get();
    
    if (doc.exists) {
      // Update existing settings
      await settingsRef.update({
        ...settings,
        updatedAt: now
      });
    } else {
      // Create new settings with defaults
      await settingsRef.set({
        ...settings,
        createdAt: now,
        updatedAt: now
      });
    }
    
    // Get the updated settings
    const updatedDoc = await settingsRef.get();
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating provider settings:', error);
    return NextResponse.json(
      { error: 'Failed to update provider settings' },
      { status: 500 }
    );
  }
}
