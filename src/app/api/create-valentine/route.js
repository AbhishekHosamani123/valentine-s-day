import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
    try {
        const body = await req.json();
        const { partner_name, message, photos, music_url } = body;

        if (!partner_name || !message || !photos || photos.length < 6) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('valentines')
            .insert([{ partner_name, message, photos, music_url }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ id: data.id, success: true }, { status: 200 });
    } catch (error) {
        console.error('Initial Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
