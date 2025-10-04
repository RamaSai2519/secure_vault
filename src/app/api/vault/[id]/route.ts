import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';
import { encrypt } from '@/lib/crypto';

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

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, username, password, url, notes } = await request.json();
        const params = await context.params;
        const { id } = params;

        if (!title || !username || !password) {
            return NextResponse.json(
                { error: 'Title, username, and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find and update the item, ensuring it belongs to the user
        const vaultItem = await VaultItem.findOneAndUpdate(
            { _id: id, userId: user.userId },
            {
                title: encrypt(title),
                username: encrypt(username),
                password: encrypt(password),
                url: url ? encrypt(url) : '',
                notes: notes ? encrypt(notes) : '',
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!vaultItem) {
            return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
        }

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

        return NextResponse.json(decryptedItem);
    } catch (error) {
        console.error('Update vault item error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await context.params;
        const { id } = params;

        await dbConnect();

        // Find and delete the item, ensuring it belongs to the user
        const vaultItem = await VaultItem.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!vaultItem) {
            return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Vault item deleted successfully' });
    } catch (error) {
        console.error('Delete vault item error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}