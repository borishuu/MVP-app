'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SubscriptionCard from '@/components/SubscriptionCard';
import CreateSubscriptionForm from '@/components/CreateSubscriptionForm';
import type { Subscription, Category } from '@/types';

export default function QuizDashboard() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch('/api/user/subscriptions');
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptions(data);
                } else {
                    console.error('Failed to fetch subscriptions');
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setLoading(false);
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

      fetchSubscriptions();
        fetchCategories();
    }, []);

    const filteredQuizzes = subscriptions.filter(subscription =>
        subscription.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (subId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
          const res = await fetch(`/api/subscription/${subId}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== subId));
          } else {
            alert('Échec de la suppression.');
          }
        }
    };
      

    const handleCreateSubscription = async (formData: any) => {
      try {
          const response = await fetch('/api/subscription', {
              method: 'POST',
              body: JSON.stringify(formData),
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
              console.error('Erreur lors de la création de l’abonnement');
              return;
          }
  
          const createdSubscription = await response.json();
          setSubscriptions((prev) => [...prev, createdSubscription]);
          setShowForm(false);
      } catch (error) {
          console.error('Erreur réseau:', error);
      }
    };
    return (
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Mes abonnements</h1>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => setShowForm(true)}
                  className="button"
                >
                  + Nouveau
                </button>
            </div>

            {loading ? (
            <p className="text-center">Chargement des abonnements...</p>
            ) : filteredQuizzes.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {filteredQuizzes.map((subscription) => (
                <div key={subscription.id} className="w-full sm:w-[45%]">
                    <SubscriptionCard subscription={subscription} categories={categories} onDelete={() => handleDelete(subscription.id)} />
                </div>
                ))}
            </div>
            ) : (
            <p className="text-center">Aucun abonnement trouvé.</p>
            )}



          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <CreateSubscriptionForm
                    onClose={() => setShowForm(false)}
                    onCreate={(newSubscription: Subscription) => handleCreateSubscription(newSubscription)}
                    categories={categories}
                    />
            </div>
          )}
        </div>
    );
}
