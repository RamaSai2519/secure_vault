'use client';

import { useState, useEffect } from 'react';
import { Copy, Edit, Trash2, Eye, EyeOff, ExternalLink, Search, Plus } from 'lucide-react';
import VaultItemModal from './VaultItemModal';

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

interface VaultListProps {
    items: VaultItem[];
    onAddItem: (item: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdateItem: (id: string, item: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onDeleteItem: (id: string) => Promise<void>;
}

export default function VaultList({ items, onAddItem, onUpdateItem, onDeleteItem }: VaultListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<VaultItem[]>(items);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [copiedPasswords, setCopiedPasswords] = useState<Set<string>>(new Set());
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

    useEffect(() => {
        const filtered = items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [items, searchTerm]);

    const togglePasswordVisibility = (id: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(id)) {
            newVisible.delete(id);
        } else {
            newVisible.add(id);
        }
        setVisiblePasswords(newVisible);
    };

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        const newCopied = new Set(copiedPasswords);
        newCopied.add(id);
        setCopiedPasswords(newCopied);

        // Auto-clear after 15 seconds
        setTimeout(() => {
            const updatedCopied = new Set(copiedPasswords);
            updatedCopied.delete(id);
            setCopiedPasswords(updatedCopied);
        }, 15000);
    };

    const handleEdit = (item: VaultItem) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleSave = async (itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
        if (editingItem) {
            await onUpdateItem(editingItem._id, itemData);
        } else {
            await onAddItem(itemData);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Your Vault</h2>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search vault items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="divide-y">
                {filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {items.length === 0 ? (
                            <div>
                                <p className="text-lg mb-2">Your vault is empty</p>
                                <p className="text-sm">Add your first password to get started</p>
                            </div>
                        ) : (
                            <p>No items match your search</p>
                        )}
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item._id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-medium text-gray-800 truncate">
                                            {item.title}
                                        </h3>
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Open URL"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500 w-16">Username:</span>
                                            <span className="text-gray-800">{item.username}</span>
                                            <button
                                                onClick={() => copyToClipboard(item.username, `${item._id}-username`)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Copy username"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            {copiedPasswords.has(`${item._id}-username`) && (
                                                <span className="text-xs text-green-600">Copied!</span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500 w-16">Password:</span>
                                            <span className="text-gray-800 font-mono">
                                                {visiblePasswords.has(item._id) ? item.password : '••••••••'}
                                            </span>
                                            <button
                                                onClick={() => togglePasswordVisibility(item._id)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title={visiblePasswords.has(item._id) ? 'Hide password' : 'Show password'}
                                            >
                                                {visiblePasswords.has(item._id) ? (
                                                    <EyeOff className="w-3 h-3" />
                                                ) : (
                                                    <Eye className="w-3 h-3" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(item.password, `${item._id}-password`)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Copy password"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            {copiedPasswords.has(`${item._id}-password`) && (
                                                <span className="text-xs text-green-600">Copied! (auto-clear in 15s)</span>
                                            )}
                                        </div>

                                        {item.notes && (
                                            <div className="flex items-start space-x-2">
                                                <span className="text-gray-500 w-16 mt-0.5">Notes:</span>
                                                <span className="text-gray-600 text-xs">{item.notes}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 text-xs text-gray-400">
                                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                                        title="Edit item"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteItem(item._id)}
                                        className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                                        title="Delete item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <VaultItemModal
                item={editingItem}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                isEditing={!!editingItem}
            />
        </div>
    );
}