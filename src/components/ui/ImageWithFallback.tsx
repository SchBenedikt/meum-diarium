import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    showIconFallback?: boolean;
}
export function ImageWithFallback({
    src,
    alt,
    className,
    fallbackSrc = '/placeholder.svg',
    showIconFallback = false,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => {
        setImgSrc(src);
        setError(false);
    }, [src]);
    const handleError = () => {
        if (!error) {
            setError(true);
            setImgSrc(fallbackSrc);
        }
    };
    if (error && showIconFallback) {
        return (
            <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
                <ImageOff className="w-1/4 h-1/4 opacity-20" />
            </div>
        );
    }
    return (
        <img
            src={imgSrc || fallbackSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
}
