'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { Subscription, Alternative, Category } from '@/types';
import EditSubscriptionForm from '@/components/EditSubscriptionForm'; 

export default function SubscriptionPage() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlternatives, setLoadingAlternatives] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

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

    const fetchAlternatives = async () => {
      try {
          //const response = await fetch(`/api/subscription/${id}/alternative`);
          const response = await fetch('/api/alternative', {
            method: 'POST',
            body: JSON.stringify({id: id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
          if (!response.ok) throw new Error('Failed to fetch alternatives');
          const data = await response.json();
          setAlternatives(data);
      } catch (error) {
          console.error('Error fetching alternatives:', error);
      } finally {
          setLoadingAlternatives(false);
      }
    };

    const fetchCategories = async () => {
      try {
          const response = await fetch('/api/category');
          if (response.ok) {
              const data = await response.json();
              setCategories(data);
          } else {
              console.error('Failed to fetch categories');
          }
      } catch (error) {
          console.error('Error fetching categories:', error);
      } finally {
          setLoading(false);
      }
    };
  

    if (id) {
      fetchSubscription();
      fetchAlternatives();
      fetchCategories();
    }
  }, [id]);

  const handleDelete = async (subId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      const res = await fetch(`/api/subscription/${subId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/');
      } else {
        alert('Échec de la suppression.');
      }
    }
  };

  if (loading) return <p className="text-center">Chargement de l'abonnement...</p>;
  if (!subscription) return <p className="text-center text-red-600">Abonnement non trouvé.</p>;

  const paymentFreqText = subscription.paymentFrequency === 1 ? 'Mensuel' : 'Annuel';

  return (
    <>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Abonnement - {subscription.title}</h1>
        <div className="space-x-2">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-blue-500">
              <Pencil size={20} />
            </button>
            <button onClick={() => handleDelete(subscription.id)} className="p-1 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xl font-semibold">
        {subscription.price.toFixed(2)} CHF <span className="text-base font-normal">{paymentFreqText}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12">
        <p><strong>Prochain paiement :</strong> {new Date(subscription.paymentDate).toLocaleDateString('fr-CH')}</p>
        <p><strong>Réception notification :</strong> {subscription.paymentNotificationTime} jours en avance</p>
        <p><strong>Fréquence d’utilisation :</strong> {subscription.usageFrequency}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Alternatives</h2>
        {loadingAlternatives ? (
          <p className="text-gray-500 italic">Chargement des alternatives...</p>
        ) : alternatives.length > 0 ? (
          <div className="rounded-md overflow-hidden border">
            {alternatives.map((alt, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0 bg-gray-50">
                <div>
                  <p className="font-medium">{alt.name}</p>
                  <p className="text-sm text-gray-600">
                    À partir de : {alt.minPrice > 0 ? `${alt.minPrice.toFixed(2)} CHF` : 'Gratuit'} ({alt.minPriceFrequency})
                  </p>
                </div>
                <a
                  href={alt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded hover:bg-gray-100"
                >
                  Visiter <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">Aucune alternative disponible.</p>
        )}
      </div>


    </div>
    {isEditing && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <EditSubscriptionForm
          subscription={subscription}
          categories={categories}
          onClose={() => setIsEditing(false)}
          onSave={(updatedSub) => {
            setSubscription(updatedSub); 
            setIsEditing(false);
          }}
        />
      </div>
    )}
    </>
  );
}
