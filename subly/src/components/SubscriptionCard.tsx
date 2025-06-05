'use client';

import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye } from 'lucide-react';

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

export default function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const router = useRouter();

  const formatFrequency = (freq: number) => {
    switch (freq) {
      case 1: return 'Mensuel';
      case 2: return 'Annuel';
      default: return `${freq} Mensuel`;
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-xl shadow p-4 w-full max-w-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">{subscription.title}</h2>
          <p className="text-sm text-gray-500">{subscription.category?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:text-blue-500">
            <Pencil size={20} />
          </button>
          <button className="p-1 hover:text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="font-semibold">{subscription.price.toFixed(2)} CHF</span>
        <span className="text-sm text-gray-600">{formatFrequency(subscription.paymentFrequency)}</span>
      </div>

      <div className="text-sm text-gray-700 mt-2">
        Prochain paiement : {new Date(subscription.paymentDate).toLocaleDateString('fr-CH')}
      </div>

      <div className="flex justify-end mt-2">
        <button
          className="button gap-2"
          onClick={() => router.push(`/subscriptions/${subscription.id}`)}
        >
          Détails <Eye size={16} />
        </button>
      </div>
    </div>
  );
}
