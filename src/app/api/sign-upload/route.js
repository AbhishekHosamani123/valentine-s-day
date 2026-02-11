import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
    try {
        const body = await req.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json({ error: 'Missing path' }, { status: 400 });
        }

        // Create a signed upload URL valid for 60 seconds
        const { data, error } = await supabaseAdmin
            .storage
            .from('photos')
            .createSignedUploadUrl(path);

        if (error) {
            console.error('Supabase Signing Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: data.path }, { status: 200 });
    } catch (error) {
        console.error('Initial Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
