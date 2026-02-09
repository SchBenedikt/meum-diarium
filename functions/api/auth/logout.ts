import type { PagesContext } from '../../types';

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    // In a real implementation, you would invalidate the token on the server
    // For now, we'll just return success - the client will handle token removal
    
    return new Response(
        JSON.stringify({
            message: 'Logout successful'
        }),
        { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        }
    );
};
