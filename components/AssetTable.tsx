'use client';

import { FileIcon, ImageIcon, Code, Type } from 'lucide-react';

interface Asset {
    id: string;
    file_type: string;
    url: string;
    size_bytes: number | null;
}

export default function AssetTable({ assets }: { assets: Asset[] }) {
    if (!assets || assets.length === 0) return <div>No assets found.</div>;

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon className="w-4 h-4 text-purple-500" />;
            case 'css': return <Code className="w-4 h-4 text-blue-500" />;
            case 'js': return <Code className="w-4 h-4 text-yellow-500" />;
            case 'font': return <Type className="w-4 h-4 text-red-500" />;
            default: return <FileIcon className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="rounded-md border">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-4 py-2 font-medium text-slate-500 w-10">Type</th>
                        <th className="px-4 py-2 font-medium text-slate-500">Resource URL</th>
                        <th className="px-4 py-2 font-medium text-slate-500 text-right">Size</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset.id} className="border-b last:border-0 hover:bg-slate-50/50 block md:table-row">
                            <td className="px-4 py-2 md:table-cell flex items-center gap-2">
                                {getIcon(asset.file_type)}
                                <span className="md:hidden capitalize">{asset.file_type}</span>
                            </td>
                            <td className="px-4 py-2 max-w-[200px] md:max-w-md truncate md:table-cell block">
                                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 block md:inline">
                                    {asset.url}
                                </a>
                            </td>
                            <td className="px-4 py-2 text-right text-slate-500 font-mono text-xs md:table-cell block">
                                {formatSize(asset.size_bytes)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
