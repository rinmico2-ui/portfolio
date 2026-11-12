-- Seed data (sample, editable)
insert into profiles (full_name, professional_title, headline, biography, location, email, availability_status, website_url)
values ('Marcus Mallari','Business Informatics Student | Web Development','Building Digital Experiences That Make an Impact.','Fourth-year BSIT student majoring in Business Informatics at PHINMA Araullo University.','Puncan, Carranglan, Nueva Ecija','maxwellmallari00@gmail.com','Available for opportunities','https://my-node-app-2-xoqr.onrender.com')
on conflict do nothing;

insert into site_settings (id, site_name, site_description, ai_assistant_enabled, ai_assistant_name, maintenance_mode)
values (1, 'Marcus Mallari Portfolio', 'Business Informatics student and web developer portfolio', true, 'Developer Assistant', false)
on conflict (id) do nothing;

-- Certificates (source PDFs: docs/certs, previews/public copy: apps/web/public/certs)
insert into certifications (id, name, issuer, issue_date, expiry_date, credential_url, image_url, display_order)
values
  ('0f1c6e2a-4a1b-4d2c-9f0a-6b3e7c1d8a21', 'Oracle Analytics Cloud 2025 Certified Professional', 'Oracle University', '2025-09-10', '2027-09-10', '/certs/oracle-analytics-cloud-2025-certified-professional.pdf', '/certs/oracle-analytics-cloud-2025-certified-professional.jpg', 1),
  ('1c9d5f3b-8e2a-4b6c-a7d3-2e4f9a0b5c32', 'Oracle Cloud Infrastructure 2025 Certified Networking Professional', 'Oracle University', '2025-10-22', null, '/certs/oracle-cloud-infrastructure-2025-certified-networking-professional.pdf', '/certs/oracle-cloud-infrastructure-2025-certified-networking-professional.jpg', 2),
  ('2e8a4c1d-9f5b-4e3a-a1c6-7d8b2e5f9a43', 'Oracle Cloud Database Services 2025 Certified Professional', 'Oracle University', '2025-10-22', null, '/certs/oracle-cloud-database-services-2025-certified-professional.pdf', '/certs/oracle-cloud-database-services-2025-certified-professional.jpg', 3)
on conflict (id) do nothing;
