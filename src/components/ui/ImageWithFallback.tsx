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
    const { style: consumerStyle, ...imgProps } = props;
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
        <div className={cn("relative overflow-hidden bg-muted/60", className)}>
            {!loaded && !error && (
                <div className="absolute inset-0 bg-muted/60 animate-pulse z-10" />
            )}
            <img
                src={imgSrc || fallbackSrc}
                alt={alt}
                className={cn("absolute inset-0 w-full h-full object-cover", loaded ? 'opacity-100' : 'opacity-0', className)}
                style={{ transition: 'all 0.5s', ...consumerStyle }}
                onError={handleError}
                onLoad={() => setLoaded(true)}
                {...imgProps}
            />
        </div>
    );
}
