import { supabaseForUser } from '../../lib/supabaseClient.js';
import type { BakeInput, CheckoutInput, WasteInput } from './counter.schema.js';

const PRODUCT_SELECT = 'id, recipe_id, name, price, category, stock';
const EVENT_SELECT = 'product_id, type, quantity, amount';
const SALE_SELECT =
  'id, created_at, total, counter_events!inner(id), order_items(product_id, quantity, unit_price, products(name))';
const WASTE_SELECT = 'id, created_at, quantity, reason, products(name)';

const cleanMessage = (message: string) => message.replace(/^[A-Z_]+: /, '');

const startOfTodayManila = () => {
  const offset = 8 * 60 * 60 * 1000;
  const manila = new Date(Date.now() + offset);
  manila.setUTCHours(0, 0, 0, 0);
  return new Date(manila.getTime() - offset).toISOString();
};

const sum = (rows: any[]) => rows.reduce((total, r) => total + r.quantity, 0);

const mapSale = (row: any) => ({
  id: row.id,
  date: row.created_at,
  total: Number(row.total),
  lines: (row.order_items ?? []).map((i: any) => ({
    productId: i.product_id,
    name: i.products?.name ?? 'Unknown',
    qty: i.quantity,
    price: Number(i.unit_price),
  })),
});

const mapWaste = (row: any) => ({
  id: row.id,
  date: row.created_at,
  productName: row.products?.name ?? 'Unknown',
  qty: row.quantity,
  reason: row.reason,
});

export class CounterService {

  static async getOverview(token: string) {
    const db = supabaseForUser(token);

    const { data: productRows, error } = await db
      .from('products')
      .select(PRODUCT_SELECT)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    const { data: eventRows, error: eventsError } = await db
      .from('counter_events')
      .select(EVENT_SELECT)
      .gte('created_at', startOfTodayManila());

    if (eventsError) {
      throw new Error(eventsError.message);
    }

    const events: any[] = eventRows ?? [];
    const total = (type: string, productId: string) =>
      sum(events.filter((e) => e.type === type && e.product_id === productId));

    const products = (productRows ?? []).map((p: any) => ({
      id: p.id,
      recipeId: p.recipe_id,
      name: p.name,
      price: Number(p.price),
      category: (p.category ?? 'BREAD').toUpperCase(),
      stock: p.stock,
      bakedToday: total('bake', p.id),
      soldToday: total('sale', p.id),
      wasteToday: total('waste', p.id),
    }));

    const sales = events.filter((e) => e.type === 'sale');

    return {
      products,
      metrics: {
        available: products.reduce((n, p) => n + p.stock, 0),
        sold: sum(sales),
        revenue: sales.reduce((n, e) => n + Number(e.amount), 0),
        baked: sum(events.filter((e) => e.type === 'bake')),
      },
    };
  }

  static async getSales(token: string) {
    const { data, error } = await supabaseForUser(token)
      .from('orders')
      .select(SALE_SELECT)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapSale);
  }

  static async checkout(token: string, input: CheckoutInput) {
    const { data, error } = await supabaseForUser(token).rpc('counter_checkout', {
      p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.qty })),
    });

    if (error) {
      throw new Error(cleanMessage(error.message));
    }

    return data;
  }

  static async getWaste(token: string) {
    const { data, error } = await supabaseForUser(token)
      .from('counter_events')
      .select(WASTE_SELECT)
      .eq('type', 'waste')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapWaste);
  }

  static async logWaste(token: string, input: WasteInput) {
    const { data, error } = await supabaseForUser(token).rpc('counter_log_waste', {
      p_product_id: input.productId,
      p_qty: input.qty,
      p_reason: input.reason,
    });

    if (error) {
      throw new Error(cleanMessage(error.message));
    }

    return data;
  }

  static async bake(token: string, input: BakeInput) {
    const { data, error } = await supabaseForUser(token).rpc('counter_bake', {
      p_product_id: input.productId,
      p_qty: input.qty,
    });

    if (error) {
      throw new Error(cleanMessage(error.message));
    }

    return { productId: input.productId, stock: data as number };
  }
}