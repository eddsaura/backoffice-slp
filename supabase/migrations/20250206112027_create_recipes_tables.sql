-- Create recipes table
create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  cooking_time_minutes integer,
  base_servings integer not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recipe_ingredients table
create table if not exists recipe_ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id) on delete cascade not null,
  ingredient_id uuid references ingredients(id) not null,
  quantity numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for recipes
alter table recipes enable row level security;

DROP POLICY IF EXISTS "Users can view their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can insert their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete their own recipes" ON recipes;

create policy "Users can view their own recipes"
  on recipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recipes"
  on recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
  on recipes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own recipes"
  on recipes for delete
  using (auth.uid() = user_id);

-- Set up RLS for recipe_ingredients
alter table recipe_ingredients enable row level security;

DROP POLICY IF EXISTS "Users can view recipe ingredients through recipes" ON recipe_ingredients;
DROP POLICY IF EXISTS "Users can insert recipe ingredients through recipes" ON recipe_ingredients;
DROP POLICY IF EXISTS "Users can update recipe ingredients through recipes" ON recipe_ingredients;
DROP POLICY IF EXISTS "Users can delete recipe ingredients through recipes" ON recipe_ingredients;

create policy "Users can view recipe ingredients through recipes"
  on recipe_ingredients for select
  using (
    exists (
      select 1 from recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  );

create policy "Users can insert recipe ingredients through recipes"
  on recipe_ingredients for insert
  with check (
    exists (
      select 1 from recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  );

create policy "Users can update recipe ingredients through recipes"
  on recipe_ingredients for update
  using (
    exists (
      select 1 from recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  );

create policy "Users can delete recipe ingredients through recipes"
  on recipe_ingredients for delete
  using (
    exists (
      select 1 from recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  );
