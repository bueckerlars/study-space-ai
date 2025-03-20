import { useEffect } from 'react';
import { useHeader } from '@/provider/HeaderProvider';

export const Dashboard = () => {
    const { setTitle } = useHeader();
    
    useEffect(() => {
        setTitle('Dashboard');
    }, [setTitle]);
    
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};