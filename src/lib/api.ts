import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { PaellaOrder, Ingredient, IngredientPurchase } from '../types/order';
import { Database } from '../types/supabase';

type SupabaseOrder = Database['public']['Tables']['paella_orders']['Row'];
type SupabaseItem = Database['public']['Tables']['paella_items']['Row'];

const transformOrder = (order: SupabaseOrder, items: SupabaseItem[]): PaellaOrder => ({
  id: order.id,
  customerName: order.customer_name,
  date: order.date,
  status: order.status,
  items: items.map(item => ({
    id: item.id,
    type: item.type,
    servings: item.servings,
  })),
  costs: order.costs,
  price: order.price,
  notes: order.notes || undefined,
});

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from('paella_orders')
        .select('*')
        .order('date', { ascending: false });

      if (ordersError) throw ordersError;

      const { data: items, error: itemsError } = await supabase
        .from('paella_items')
        .select('*');

      if (itemsError) throw itemsError;

      return orders.map(order => 
        transformOrder(
          order,
          items.filter(item => item.order_id === order.id)
        )
      );
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Omit<PaellaOrder, 'id'>) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: order, error: orderError } = await supabase
        .from('paella_orders')
        .insert({
        customer_name: orderData.customerName,
        date: orderData.date,
        status: orderData.status,
        costs: orderData.costs,
        price: orderData.price,
        notes: orderData.notes || null,
        user_id: userData.user.id,
      })
      .select()
      .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from('paella_items')
        .insert(
          orderData.items.map(item => ({
            order_id: order.id,
            type: item.type,
            servings: item.servings,
          }))
        );

      if (itemsError) throw itemsError;
    },
    onSuccess: () => {
      // Invalidate and refetch orders after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orderData }: { id: string; orderData: Omit<PaellaOrder, 'id'> }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Update order details
      const { error: orderError } = await supabase
        .from('paella_orders')
        .update({
          customer_name: orderData.customerName,
          date: orderData.date,
          status: orderData.status,
          costs: orderData.costs,
          price: orderData.price,
          notes: orderData.notes || null,
        })
        .eq('id', id)
        .eq('user_id', userData.user.id);

      if (orderError) throw orderError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('paella_items')
        .delete()
        .eq('order_id', id);

      if (deleteError) throw deleteError;

      // Insert new items
      const { error: itemsError } = await supabase
        .from('paella_items')
        .insert(
          orderData.items.map(item => ({
            order_id: id,
            type: item.type,
            servings: item.servings,
          }))
        );

      if (itemsError) throw itemsError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      if (error) throw error;

      return data.map((ingredient): Ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
      }));
    },
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Ingredient, 'id'>) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase.from('ingredients').insert({
        name: data.name,
        unit: data.unit,
        user_id: userData.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useIngredientPurchases(orderId?: string) {
  return useQuery({
    queryKey: ['ingredient-purchases', orderId],
    queryFn: async () => {
      let query = supabase
        .from('ingredient_purchases')
        .select(`
          *,
          ingredients (
            name,
            unit
          )
        `)
        .order('purchase_date', { ascending: false });

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((purchase): IngredientPurchase & { ingredient: Ingredient } => ({
        id: purchase.id,
        ingredientId: purchase.ingredient_id,
        orderId: purchase.order_id || undefined,
        quantity: purchase.quantity,
        price: purchase.price,
        unit_price: purchase.unit_price,
        supplier: purchase.supplier,
        purchaseDate: purchase.purchase_date,
        notes: purchase.notes || undefined,
        ingredient: {
          id: purchase.ingredient_id,
          name: purchase.ingredients.name,
          unit: purchase.ingredients.unit,
        },
      }));
    },
  });
}

export function useCreateIngredientPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<IngredientPurchase, 'id'>) => {
      const { error } = await supabase.from('ingredient_purchases').insert({
        ingredient_id: data.ingredientId,
        order_id: data.orderId || null,
        quantity: data.quantity,
        price: data.price,
        unit_price: data.unit_price,
        supplier: data.supplier,
        purchase_date: data.purchaseDate,
        notes: data.notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredient-purchases'] });
    },
  });
}