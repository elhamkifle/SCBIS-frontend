"use client";

interface StageCardProps {
    title: string;
    children: React.ReactNode;
}

export function StageCard({ title, children }: StageCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 w-full">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">{title}</h1>
            {children}
        </div>
    );
} 