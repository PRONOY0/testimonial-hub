'use client';

export function Loader({
    size = 32,
    className = '',
}: {
    size?: number;
    className?: string;
}) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
                style={{
                    width: size,
                    height: size,
                }}
            />
        </div>
    );
}
