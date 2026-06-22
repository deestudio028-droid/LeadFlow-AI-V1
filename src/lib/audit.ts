import { createAdminClient } from '@/lib/supabase/admin'

export async function logAdminAction({
  actorId,
  action,
  targetType,
  targetId,
  details
}: {
  actorId: string,
  action: string,
  targetType: string,
  targetId?: string | null,
  details?: Record<string, any>
}) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient
    .from('audit_logs')
    .insert({
      actor_id: actorId,
      action,
      target_type: targetType,
      target_id: targetId,
      details
    })

  if (error) {
    console.error('Failed to write audit log:', error)
  }
}
