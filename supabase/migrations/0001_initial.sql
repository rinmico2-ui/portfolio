-- Initial schema for portfolio ecosystem
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  professional_title text,
  headline text,
  biography text,
  profile_image_url text,
  location text,
  email text,
  availability_status text,
  github_url text,
  linkedin_url text,
  facebook_url text,
  website_url text,
  resume_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists skill_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  display_order int default 0
);

create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category_id uuid references skill_categories(id) on delete cascade,
  proficiency int,
  icon_url text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  summary text,
  description text,
  cover_image_url text,
  category text,
  tech_stack text[] default '{}',
  status text default 'draft',
  featured boolean default false,
  live_url text,
  github_url text,
  development_date date,
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  url text not null,
  alt text,
  display_order int default 0
);

create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  position text not null,
  location text,
  start_date date,
  end_date date,
  current boolean default false,
  description text,
  responsibilities text[] default '{}',
  technologies text[] default '{}',
  achievements text[] default '{}',
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date date,
  end_date date,
  description text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_url text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null
);

create table if not exists blog_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null
);

create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  category_id uuid references blog_categories(id) on delete set null,
  status text default 'draft',
  featured boolean default false,
  published_at timestamptz,
  scheduled_at timestamptz,
  reading_time_minutes int default 1,
  seo_title text,
  seo_description text,
  views int default 0,
  author_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists blog_post_tags (
  post_id uuid references blog_posts(id) on delete cascade,
  tag_id uuid references blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread',
  created_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  role text default 'admin',
  created_at timestamptz default now()
);

create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  path text,
  referrer text,
  device text,
  created_at timestamptz default now(),
  metadata jsonb
);

create table if not exists ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references ai_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  id int primary key default 1,
  site_name text,
  site_description text,
  primary_color text,
  secondary_color text,
  ai_assistant_enabled boolean default true,
  ai_assistant_name text,
  maintenance_mode boolean default false,
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_contact_messages_status on contact_messages(status);
create index if not exists idx_analytics_type on analytics_events(type);

-- RLS
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table skills enable row level security;
alter table skill_categories enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table blog_posts enable row level security;
alter table blog_categories enable row level security;
alter table blog_tags enable row level security;
alter table blog_post_tags enable row level security;
alter table contact_messages enable row level security;
alter table analytics_events enable row level security;
alter table site_settings enable row level security;

-- Public read policies
create policy "Public read profiles" on profiles for select using (true);
create policy "Public read projects" on projects for select using (status = 'published');
create policy "Public read project_images" on project_images for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read skill_categories" on skill_categories for select using (true);
create policy "Public read experiences" on experiences for select using (true);
create policy "Public read education" on education for select using (true);
create policy "Public read certifications" on certifications for select using (true);
create policy "Public read blog_posts" on blog_posts for select using (status = 'published');
create policy "Public read blog_categories" on blog_categories for select using (true);
create policy "Public read blog_tags" on blog_tags for select using (true);
create policy "Public read blog_post_tags" on blog_post_tags for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);

-- Contact messages insert by anyone
create policy "Anyone can submit contact" on contact_messages for insert with check (true);

-- Analytics insert by anyone
create policy "Anyone can track" on analytics_events for insert with check (true);
