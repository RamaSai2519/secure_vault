'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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

interface VaultItemModalProps {
    item: VaultItem | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    isEditing: boolean;
}

export default function VaultItemModal({ item, isOpen, onClose, onSave, isEditing }: VaultItemModalProps) {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        username: item?.username || '',
        password: item?.password || '',
        url: item?.url || '',
        notes: item?.notes || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.username || !formData.password) {
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
            setFormData({ title: '', username: '', password: '', url: '', notes: '' });
        } catch (error) {
            console.error('Error saving vault item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-300 shadow-2xl rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {isEditing ? 'Edit' : 'Add'} Vault Item
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Gmail Account"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., john@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                            URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}