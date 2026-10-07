-- Seed data for roles, units and categories.
-- Runs automatically after migrations on `supabase db reset`.

INSERT INTO roles (name, description) VALUES
    ('admin',   'Full access to all data and settings'),
    ('manager', 'Manages recipes, ingredients, batches and reports'),
    ('baker',   'Records batches and stocks the display counter'),
    ('cashier', 'Rings up sales at the counter')
ON CONFLICT (name) DO NOTHING;

INSERT INTO units (name, abbreviation, unit_type, base_factor) VALUES
    ('gram',        'g',     'weight', 1),
    ('kilogram',    'kg',    'weight', 1000),
    ('ounce',       'oz',    'weight', 28.349523),
    ('pound',       'lb',    'weight', 453.59237),
    ('milliliter',  'ml',    'volume', 1),
    ('liter',       'l',     'volume', 1000),
    ('teaspoon',    'tsp',   'volume', 4.928922),
    ('tablespoon',  'tbsp',  'volume', 14.786765),
    ('cup',         'cup',   'volume', 236.588237),
    ('piece',       'pc',    'count',  1),
    ('dozen',       'doz',   'count',  12),
    ('pack',        'pack',  'count',  1)
ON CONFLICT (abbreviation) DO NOTHING;

INSERT INTO categories (name, scope) VALUES
    ('Flour and grains',     'ingredient'),
    ('Sugar and sweeteners', 'ingredient'),
    ('Dairy and eggs',       'ingredient'),
    ('Fats and oils',        'ingredient'),
    ('Leavening',            'ingredient'),
    ('Flavorings',           'ingredient'),
    ('Fillings and toppings','ingredient'),
    ('Packaging',            'ingredient'),
    ('Bread',                'product'),
    ('Cakes',                'product'),
    ('Pastries',             'product'),
    ('Cookies',              'product'),
    ('Beverages',            'product')
ON CONFLICT (name, scope) DO NOTHING;
