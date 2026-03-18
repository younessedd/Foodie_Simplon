import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => set((state) => ({
        orders: [
          {
            id: `order-${Date.now()}`,
            items: order.items,
            total: order.total,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
          },
          ...state.orders,
        ],
      })),
      
      removeOrder: (orderId) => set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
      })),
      
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
      })),
      
      updateOrderItems: (orderId, newItems) => set((state) => ({
        orders: state.orders.map((order) => {
          if (order.id === orderId) {
            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return { ...order, items: newItems, total: newTotal };
          }
          return order;
        }),
      })),
      
      getOrder: (orderId) => get().orders.find((order) => order.id === orderId),
    }),
    {
      name: 'foodie-orders',
    }
  )
);

export default useOrderStore;
