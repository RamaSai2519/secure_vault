'use client';

import { useState, useEffect, useCallback } from 'react';
import { LogOut, Shield } from 'lucide-react';
import PasswordGenerator from './PasswordGenerator';
import VaultList from './VaultList';

interface VaultItem {
    _id: string;
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

interface DashboardProps {
    token: string;
    onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
    const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVaultItems = useCallback(async () => {
        try {
            const response = await fetch('/api/vault', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const items = await response.json();
                setVaultItems(items);
            }
        } catch (error) {
            console.error('Error fetching vault items:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchVaultItems();
    }, [fetchVaultItems]);

    const handleAddItem = async (itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const response = await fetch('/api/vault', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                const newItem = await response.json();
                setVaultItems([newItem, ...vaultItems]);
            }
        } catch (error) {
            console.error('Error adding vault item:', error);
        }
    };

    const handleUpdateItem = async (id: string, itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const response = await fetch(`/api/vault/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setVaultItems(vaultItems.map(item => item._id === id ? updatedItem : item));
            }
        } catch (error) {
            console.error('Error updating vault item:', error);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`/api/vault/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setVaultItems(vaultItems.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Error deleting vault item:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-blue-600 animate-pulse" />
                    <p className="mt-4 text-gray-600">Loading your vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Secure Vault</h1>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <PasswordGenerator />
                    </div>
                    <div className="lg:col-span-2">
                        <VaultList
                            items={vaultItems}
                            onAddItem={handleAddItem}
                            onUpdateItem={handleUpdateItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}