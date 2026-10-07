-- Users and roles 
CREATE TABLE roles (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        varchar(50)  NOT NULL UNIQUE,
    description text
);

CREATE TABLE profiles (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id     uuid         NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    full_name   varchar(120) NOT NULL,
    email       varchar(255) NOT NULL UNIQUE,
    is_active   boolean      NOT NULL DEFAULT true,
    created_at  timestamptz  NOT NULL DEFAULT now()
);

-- Lookups 
CREATE TABLE categories (
    id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name  varchar(80) NOT NULL,
    scope varchar(20) NOT NULL CHECK (scope IN ('ingredient', 'product')),
    UNIQUE (name, scope)
);

CREATE TABLE units (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name         varchar(50)  NOT NULL,
    abbreviation varchar(10)  NOT NULL UNIQUE,
    unit_type    varchar(10)  NOT NULL CHECK (unit_type IN ('weight', 'volume', 'count')),
    base_factor  numeric(18,6) NOT NULL DEFAULT 1 CHECK (base_factor > 0)
);

-- Ingredients and recipes 
CREATE TABLE ingredients (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id   uuid         NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    base_unit_id  uuid         NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    name          varchar(120) NOT NULL UNIQUE,
    cost_per_unit numeric(12,4) NOT NULL DEFAULT 0 CHECK (cost_per_unit >= 0),
    stock_qty     numeric(14,3) NOT NULL DEFAULT 0,
    reorder_level numeric(14,3) NOT NULL DEFAULT 0
);

CREATE TABLE recipes (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id      uuid         NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    yield_unit_id    uuid         NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    name             varchar(120) NOT NULL,
    yield_qty        numeric(12,3) NOT NULL CHECK (yield_qty > 0),
    selling_price    numeric(12,2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
    shelf_life_hours integer       CHECK (shelf_life_hours > 0),
    is_active        boolean       NOT NULL DEFAULT true
);

CREATE TABLE recipe_ingredients (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id     uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    unit_id       uuid NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    quantity      numeric(12,3) NOT NULL CHECK (quantity > 0),
    UNIQUE (recipe_id, ingredient_id)
);

-- Production and display counter 
CREATE TABLE batches (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id     uuid         NOT NULL REFERENCES recipes(id) ON DELETE RESTRICT,
    produced_by   uuid         NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    batch_code    varchar(40)  NOT NULL UNIQUE,
    qty_produced  numeric(12,3) NOT NULL CHECK (qty_produced > 0),
    produced_at   timestamptz  NOT NULL DEFAULT now(),
    expires_at    timestamptz,
    status        varchar(20)  NOT NULL DEFAULT 'completed'
                  CHECK (status IN ('in_progress', 'completed', 'discarded'))
);

CREATE TABLE display_items (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id      uuid         NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
    stocked_by    uuid         NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    qty_stocked   numeric(12,3) NOT NULL CHECK (qty_stocked > 0),
    qty_remaining numeric(12,3) NOT NULL CHECK (qty_remaining >= 0),
    price         numeric(12,2) NOT NULL CHECK (price >= 0),
    stocked_at    timestamptz  NOT NULL DEFAULT now(),
    status        varchar(20)  NOT NULL DEFAULT 'on_display'
                  CHECK (status IN ('on_display', 'sold_out', 'expired', 'removed')),
    CHECK (qty_remaining <= qty_stocked)
);

-- Sales 
CREATE TABLE sales (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sold_by        uuid         NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount   numeric(12,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    payment_method varchar(20)  NOT NULL DEFAULT 'cash'
                   CHECK (payment_method IN ('cash', 'card', 'ewallet', 'other')),
    sold_at        timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE sale_items (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id         uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    display_item_id uuid NOT NULL REFERENCES display_items(id) ON DELETE RESTRICT,
    quantity        numeric(12,3) NOT NULL CHECK (quantity > 0),
    unit_price      numeric(12,2) NOT NULL CHECK (unit_price >= 0)
);

-- Indexes on foreign keys used in joins 
CREATE INDEX idx_profiles_role          ON profiles(role_id);
CREATE INDEX idx_ingredients_category   ON ingredients(category_id);
CREATE INDEX idx_recipes_category       ON recipes(category_id);
CREATE INDEX idx_recipe_ing_ingredient  ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_batches_recipe         ON batches(recipe_id);
CREATE INDEX idx_display_batch          ON display_items(batch_id);
CREATE INDEX idx_sale_items_sale        ON sale_items(sale_id);
CREATE INDEX idx_sale_items_display     ON sale_items(display_item_id);
CREATE INDEX idx_sales_sold_at          ON sales(sold_at);

