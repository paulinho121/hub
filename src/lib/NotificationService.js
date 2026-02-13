import { mockSupabaseOperations } from './supabase';

/**
 * Service to handle user notifications and preferences
 * In a production environment, this would interface with an API (Node.js/Edge Functions)
 * that connects to Twilio, SendGrid, etc.
 */

// Mock function to simulate sending an email
export const sendEmailNotification = async (email, type, data) => {
  console.log(`[Mock Email Service] Sending ${type} email to ${email}`, data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, timestamp: new Date().toISOString() };
};

// Mock function to simulate sending a WhatsApp message
export const sendWhatsAppNotification = async (phone, type, data) => {
  console.log(`[Mock WhatsApp Service] Sending ${type} message to ${phone}`, data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, timestamp: new Date().toISOString() };
};

// Get notification preferences for a user
export const getNotificationPreferences = async (userId) => {
  return await mockSupabaseOperations.getUserNotificationPreferences(userId);
};

// Save notification preferences
export const saveNotificationPreferences = async (userId, preferences) => {
  return await mockSupabaseOperations.updateUserNotificationPreferences(userId, preferences);
};