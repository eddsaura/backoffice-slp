import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { PaellaOrder, Ingredient, IngredientPurchase, Recipe, RecipeIngredient } from '../types/order';
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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: orders, error: ordersError } = await supabase
        .from('paella_orders')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false });

      if (ordersError) throw ordersError;

      const { data: items, error: itemsError } = await supabase
        .from('paella_items')
        .select('*')
        .in('order_id', orders.map(order => order.id));

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

      // Get existing items
      const { data: existingItems, error: getItemsError } = await supabase
        .from('paella_items')
        .select('*')
        .eq('order_id', id);

      if (getItemsError) throw getItemsError;

      // Find items to delete (items that exist in DB but not in orderData)
      const itemsToDelete = existingItems.filter(
        existingItem => !orderData.items.some(item => item.id === existingItem.id)
      );

      // Find items to update (items that exist in both DB and orderData)
      const itemsToUpdate = orderData.items.filter(item => item.id).map(item => ({
        id: item.id,
        order_id: id,
        type: item.type,
        servings: item.servings,
      }));

      // Find items to insert (items that don't have an id)
      const itemsToInsert = orderData.items
        .filter(item => !item.id)
        .map(item => ({
          order_id: id,
          type: item.type,
          servings: item.servings,
        }));

      // Delete removed items
      if (itemsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('paella_items')
          .delete()
          .in('id', itemsToDelete.map(item => item.id));

        if (deleteError) throw deleteError;
      }

      // Update existing items
      if (itemsToUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from('paella_items')
          .upsert(itemsToUpdate);

        if (updateError) throw updateError;
      }

      // Insert new items
      if (itemsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('paella_items')
          .insert(itemsToInsert);

        if (insertError) throw insertError;
      }
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
        isUnitPrice: false,
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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase.from('ingredient_purchases').insert({
        ingredient_id: data.ingredientId,
        order_id: data.orderId || null,
        quantity: data.quantity,
        price: data.price,
        unit_price: data.unit_price,
        supplier: data.supplier,
        purchase_date: data.purchaseDate,
        notes: data.notes || null,
        user_id: userData.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredient-purchases'] });
    },
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { recipe: Partial<Recipe> }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: data.recipe.name,
          description: data.recipe.description,
          cooking_time_minutes: data.recipe.cookingTimeMinutes,
          base_servings: data.recipe.baseServings,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert recipe ingredients
      if (data.recipe.ingredients?.length) {
        const { error: ingredientsError } = await supabase
          .from("recipe_ingredients")
          .insert(
            data.recipe.ingredients.map((ing: RecipeIngredient) => ({
              recipe_id: recipeData.id,
              ingredient_id: ing.ingredientId,
              quantity: ing.quantity,
            }))
          );

        if (ingredientsError) throw ingredientsError;
      }

      return recipeData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            *,
            ingredients (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      return recipes.map((recipe): Recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description || undefined,
        cookingTimeMinutes: recipe.cooking_time_minutes || undefined,
        baseServings: recipe.base_servings,
        createdAt: recipe.created_at,
        ingredients: recipe.recipe_ingredients.map((ri): RecipeIngredient => ({
          id: ri.id,
          recipeId: ri.recipe_id,
          ingredientId: ri.ingredient_id,
          quantity: ri.quantity,
          createdAt: ri.created_at,
          ingredient: {
            id: ri.ingredients.id,
            name: ri.ingredients.name,
            unit: ri.ingredients.unit,
          },
        })),
      }));
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; recipe: Partial<Recipe> }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Update recipe details
      const { error: recipeError } = await supabase
        .from("recipes")
        .update({
          name: data.recipe.name,
          description: data.recipe.description,
          cooking_time_minutes: data.recipe.cookingTimeMinutes,
          base_servings: data.recipe.baseServings,
        })
        .eq('id', data.id)
        .eq('user_id', userData.user.id);

      if (recipeError) throw recipeError;

      // Get existing ingredients
      const { data: existingIngredients, error: getIngredientsError } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', data.id);

      if (getIngredientsError) throw getIngredientsError;

      // Find ingredients to delete
      const ingredientsToDelete = existingIngredients.filter(
        existingIng => !data.recipe.ingredients?.some(ing => 
          ing.ingredientId === existingIng.ingredient_id && 
          ing.quantity === existingIng.quantity
        )
      );

      // Find ingredients to insert (new ones)
      const ingredientsToInsert = data.recipe.ingredients?.filter(ing => 
        !existingIngredients.some(existingIng => 
          ing.ingredientId === existingIng.ingredient_id && 
          ing.quantity === existingIng.quantity
        )
      );

      // Delete removed ingredients
      if (ingredientsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .in('id', ingredientsToDelete.map(ing => ing.id));

        if (deleteError) throw deleteError;
      }

      // Insert new ingredients
      if (ingredientsToInsert?.length) {
        const { error: insertError } = await supabase
          .from('recipe_ingredients')
          .insert(
            ingredientsToInsert.map(ing => ({
              recipe_id: data.id,
              ingredient_id: ing.ingredientId,
              quantity: ing.quantity,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}