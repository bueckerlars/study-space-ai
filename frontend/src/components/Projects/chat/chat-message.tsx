import { Button } from '@/components/ui/button';
import { Copy, Pin } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
    role: 'user' | 'ai';
    message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, message }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(message);
    };

    return (
        <div className={`${role === 'user' ? 'self-end' : 'self-start'}`}>
            <div className={`chat-message bg-accent text-white p-4 rounded-lg my-2 max-w-lg`}> {/* Tailwind classes for styling */}
                <ReactMarkdown >
                    {message}
                </ReactMarkdown>
            </div>
            {role === 'ai' && (
                <div className="flex flex-row gap-2">
                    <Button variant={"outline"}>
                        <Pin />
                        Save to Note
                    </Button>
                    <Button 
                        onClick={copyToClipboard} 
                        variant={"ghost"}>
                        <Copy />
                    </Button>
                </div>
            )}
        </div>
);
};

export default ChatMessage;