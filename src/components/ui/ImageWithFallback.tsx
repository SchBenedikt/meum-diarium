import React, { useState, useEffect, useCallback } from 'react';
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
    const [loaded, setLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => {
        setImgSrc(src);
        setError(false);
        setLoaded(false);
    }, [src]);
    const handleError = useCallback(() => {
        if (!error) {
            setError(true);
            setImgSrc(fallbackSrc);
        }
    }, [error, fallbackSrc]);
    if (error && showIconFallback) {
        return (
            <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
                <ImageOff className="w-1/4 h-1/4 opacity-20" />
            </div>
        );
    }
    return (
        <div className="relative w-full h-full overflow-hidden">
            {!loaded && !error && (
                <div className={cn("absolute inset-0 bg-muted/60 animate-pulse", className)} />
            )}
            <img
                src={imgSrc || fallbackSrc}
                alt={alt}
                className={cn("transition-opacity duration-500 w-full h-full", loaded ? 'opacity-100' : 'opacity-0', className)}
                onError={handleError}
                onLoad={() => setLoaded(true)}
                {...props}
            />
        </div>
    );
}
