export interface Alternative {
    name: string;
    minPrice: number;
    minPriceFrequency: string;
    url: string;
}
  
  
export interface Subscription {
    id: number;
    title: string;
    price: number;
    paymentFrequency: number;
    paymentDate: string;
    paymentNotificationTime: number;
    usageFrequency: string;
    category: {
        name: string;
    };
}

export interface Category {
    id: number;
    name: string;
}