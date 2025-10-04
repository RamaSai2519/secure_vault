import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';
import { encrypt, decrypt } from '@/lib/crypto';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string; email: string };
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const vaultItems = await VaultItem.find({ userId: user.userId }).sort({ createdAt: -1 });

        // Decrypt items for the client
        const decryptedItems = vaultItems.map(item => ({
            _id: item._id,
            title: decrypt(item.title),
            username: decrypt(item.username),
            password: decrypt(item.password),
            url: item.url ? decrypt(item.url) : '',
            notes: item.notes ? decrypt(item.notes) : '',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return NextResponse.json(decryptedItems);
    } catch (error) {
        console.error('Get vault items error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, username, password, url, notes } = await request.json();

        if (!title || !username || !password) {
            return NextResponse.json(
                { error: 'Title, username, and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Encrypt sensitive data before storing
        const vaultItem = await VaultItem.create({
            userId: user.userId,
            title: encrypt(title),
            username: encrypt(username),
            password: encrypt(password),
            url: url ? encrypt(url) : '',
            notes: notes ? encrypt(notes) : '',
        });

        // Return decrypted version to client
        const decryptedItem = {
            _id: vaultItem._id,
            title,
            username,
            password,
            url: url || '',
            notes: notes || '',
            createdAt: vaultItem.createdAt,
            updatedAt: vaultItem.updatedAt,
        };

        return NextResponse.json(decryptedItem, { status: 201 });
    } catch (error) {
        console.error('Create vault item error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}