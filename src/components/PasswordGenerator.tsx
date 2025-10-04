'use client';

import { useState } from 'react';
import { generatePassword } from '@/lib/crypto';
import { Copy, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(12);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        const newPassword = generatePassword({
            length,
            includeNumbers,
            includeLetters,
            includeSymbols,
            excludeLookAlikes,
        });
        setPassword(newPassword);
    };

    const handleCopy = async () => {
        if (password) {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Password Generator</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                        Length: {length}
                    </label>
                    <input
                        id="length"
                        type="range"
                        min="4"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={includeLetters}
                            onChange={(e) => setIncludeLetters(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Include Letters</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Include Numbers</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Include Symbols</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={excludeLookAlikes}
                            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Exclude Look-alikes</span>
                    </label>
                </div>

                <button
                    onClick={handleGenerate}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate Password</span>
                </button>

                {password && (
                    <div className="bg-gray-50 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-800 break-all flex-1 mr-2">
                                {password}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                title="Copy to clipboard"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-xs text-green-600 mt-2">Copied to clipboard!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}