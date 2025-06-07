'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';


interface Subscription {
    id: number;
    title: string;
    price: number;
    paymentFrequency: number;
    paymentDate: string;
    category: {
      name: string;
    };
}

export default function SubscriptionPage() {
    const { id } = useParams();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch(`/api/subscription/${id}`);
                if (!response.ok) throw new Error('Failed to fetch subscription');
                const data = await response.json();
                setSubscription(data);
            } catch (error) {
                console.error('Error fetching subscription:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSubscription();
    }, [id]);

    if (loading) return <p className="text-center">Chargement de l'abonnement...</p>;
    if (!subscription) return <p className="text-center text-red-600">Abonnement pas trouvé.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">{subscription.title}</h1>
            <div className="space-y-6">

            </div>
        </div>
    );
}
