import prisma from '@/src/lib/prisma';

export async function logAuditEvent(
  userId: string,
  userEmail: string,
  action: string,
  details: any,
  ipAddress?: string | null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action,
        details: typeof details === 'string' ? details : JSON.stringify(details),
        ipAddress: ipAddress || null
      }
    });
  } catch (err) {
    console.error('Failed to save audit log:', err);
  }
}
