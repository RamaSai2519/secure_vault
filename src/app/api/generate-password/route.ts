import { NextRequest, NextResponse } from 'next/server';
import { generatePassword } from '@/lib/crypto';

export async function POST(request: NextRequest) {
    try {
        const { length, includeNumbers, includeLetters, includeSymbols, excludeLookAlikes } = await request.json();

        if (!length || length < 4 || length > 128) {
            return NextResponse.json(
                { error: 'Length must be between 4 and 128 characters' },
                { status: 400 }
            );
        }

        const password = generatePassword({
            length,
            includeNumbers: includeNumbers ?? true,
            includeLetters: includeLetters ?? true,
            includeSymbols: includeSymbols ?? false,
            excludeLookAlikes: excludeLookAlikes ?? true,
        });

        return NextResponse.json({ password });
    } catch (error) {
        console.error('Password generation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}