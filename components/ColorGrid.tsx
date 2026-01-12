'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ColorGrid({ colors }: { colors: string[] }) {
    if (!colors || colors.length === 0) {
        return <div className="text-slate-500 text-sm">No dominant colors detected.</div>;
    }

    return (
        <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
            {colors.map((color, idx) => (
                <div key={idx} className="group relative flex flex-col items-center">
                    <div
                        className="w-full aspect-square rounded-md shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                    <span className="text-[10px] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-white dark:bg-black px-1 rounded shadow">
                        {color}
                    </span>
                </div>
            ))}
        </div>
    );
}
