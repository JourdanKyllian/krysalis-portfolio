import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Composant Supabase introuvable.' }, { status: 500 });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { error } = await supabase
      .from('form_rate_limits')
      .delete()
      .lt('created_at', oneWeekAgo.toISOString());

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Purge exécutée avec succès.' });

  } catch (err) {
    console.error('Échec de la maintenance (Cron) :', err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Erreur' }, { status: 500 });
  }
}
