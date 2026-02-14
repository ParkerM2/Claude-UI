/**
 * Email-related types
 */

/**
 * Attachment for an email
 */
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  path?: string;
}

/**
 * Complete email structure for sending
 */
export interface Email {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

/**
 * Email draft — partial email being composed
 */
export interface EmailDraft {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

/**
 * SMTP provider preset names
 */
export type SmtpProvider = 'gmail' | 'outlook' | 'yahoo' | 'custom';

/**
 * SMTP configuration for sending emails
 */
export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  provider?: SmtpProvider;
}

/**
 * Result of sending an email
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email status for tracking
 */
export type EmailStatus = 'pending' | 'sent' | 'failed' | 'queued';

/**
 * Queued email for retry
 */
export interface QueuedEmail {
  id: string;
  email: Email;
  status: EmailStatus;
  attempts: number;
  lastAttempt?: string;
  error?: string;
  createdAt: string;
}
