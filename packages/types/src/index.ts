export type Order = {
  id: string;
  customerName: string;
  amount: number;
  createdAt: string;
  status: 'CREATED' | 'CONFIRMED' | 'CANCELLED';
};

export type OrderCreatedEvent = {
  detailType: 'OrderCreated';
  source: 'orderflow.api';
  detail: Order;
};
