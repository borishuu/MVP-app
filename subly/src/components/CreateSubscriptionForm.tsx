'use client';

import { useState } from 'react';

interface SubscriptionFormProps {
  onClose: () => void;
  onCreate: (data: any) => void;
  categories: { id: number; name: string }[];
}

export default function CreateSubscriptionForm({ onClose, onCreate, categories }: SubscriptionFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentDate, setPaymentDate] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [notificationTime, setNotificationTime] = useState('5');
  const [receiveFreqDemands, setReceiveFreqDemands] = useState(true);

  const handleSubmit = () => {
    onCreate({
      title,
      category,
      price: parseFloat(price),
      frequency: frequency === 'monthly' ? 1 : 2,
      paymentDate: new Date(paymentDate),
      receiveNotifications,
      paymentNotificationTime: parseInt(notificationTime),
      receiveFreqDemands,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4">Nouvel abonnement</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nom..."
        className="w-full border rounded-full px-4 py-2 mb-3"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-full px-4 py-2 mb-3 text-gray-500"
      >
        <option value="">Catégorie...</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          placeholder="Prix..."
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2"
        />
        <div className="flex gap-2 items-center text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="frequency"
              checked={frequency === 'monthly'}
              onChange={() => setFrequency('monthly')}
            />
            Mensuel
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="frequency"
              checked={frequency === 'yearly'}
              onChange={() => setFrequency('yearly')}
            />
            Annuel
          </label>
        </div>
      </div>

      <input
        type="date"
        value={paymentDate}
        onChange={(e) => setPaymentDate(e.target.value)}
        className="w-full border rounded-full px-4 py-2 mb-3"
      />

      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={receiveNotifications}
          onChange={(e) => setReceiveNotifications(e.target.checked)}
        />
        <span>Recevoir des notifications pour cet abonnement</span>
      </div>

      <div className="mb-3">
        <label className="block mb-1 text-sm text-gray-600">Être notifié ...</label>
        <select
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          className="w-full border rounded-full px-4 py-2"
        >
          <option value="1">1 jour en avance</option>
          <option value="3">3 jours en avance</option>
          <option value="5">5 jours en avance</option>
          <option value="7">7 jours en avance</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={receiveFreqDemands}
          onChange={(e) => setReceiveFreqDemands(e.target.checked)}
        />
        <span>Recevoir des demandes de fréquence d’utilisation</span>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="button"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="button"
        >
          Créer
        </button>
      </div>
    </div>
  );
}
