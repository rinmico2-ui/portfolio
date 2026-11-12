-- Certifications: add preview image to match the app certification model
alter table certifications add column if not exists image_url text;
