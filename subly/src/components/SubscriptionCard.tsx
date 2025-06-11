'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye } from 'lucide-react';
import EditSubscriptionForm from '@/components/EditSubscriptionForm'; 

interface Subscription {
  id: number;
  title: string;
  price: number;
  paymentFrequency: number;
  paymentDate: string;
  notificationDays: number;
  usageFrequency: string;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  subscription: Subscription;
  categories: Category[];
  onUpdated?: () => void; 
}

export default function SubscriptionCard({ subscription, categories, onUpdated }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [localSubscription, setLocalSubscription] = useState<Subscription>(subscription);

  const formatFrequency = (freq: number) => {
    switch (freq) {
      case 1: return 'Mensuel';
      case 2: return 'Annuel';
      default: return `${freq} Mensuel`;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 bg-white rounded-xl shadow p-4 w-full max-w-md border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">{localSubscription.title}</h2>
            <p className="text-sm text-gray-500">{localSubscription.category?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-blue-500">
              <Pencil size={20} />
            </button>
            <button className="p-1 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="font-semibold">{localSubscription.price.toFixed(2)} CHF</span>
          <span className="text-sm text-gray-600">{formatFrequency(localSubscription.paymentFrequency)}</span>
        </div>

        <div className="text-sm text-gray-700 mt-2">
          Prochain paiement : {new Date(localSubscription.paymentDate).toLocaleDateString('fr-CH')}
        </div>

        <div className="flex justify-end mt-2">
          <button
            className="button gap-2"
            onClick={() => router.push(`/subscription/${localSubscription.id}`)}
          >
            Détails <Eye size={16} />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <EditSubscriptionForm
            subscription={localSubscription}
            categories={categories}
            onClose={() => setIsEditing(false)}
            onSave={(updatedSub) => {
              setLocalSubscription(updatedSub); 
              setIsEditing(false);
              onUpdated?.();
            }}
          />
        </div>
      )}
    </>
  );
}
