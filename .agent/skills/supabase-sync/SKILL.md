---
name: supabase-sync
description: >-
  Procedures for managing Supabase database schema, RLS policies, storage bucket policies,
  and client synchronization logic for IndexLib.
---

# Supabase Management Skill for IndexLib

## 1. Moderation Workflow & RLS Policies

When modifying the database schema or policies in `supabase/schema.sql`:

1. **Catalog Books Table (`public.catalog_books`):**
   - Statuses allowed: `'draft'`, `'pending_review'`, `'published'`, `'rejected'`, `'archived'`.
   - Default status on insert must be `'pending_review'`.
   - Authors can view their own books in any status.
   - Admins can view all books in any status.
   - Public readers can only query `status = 'published'`.

2. **Storage Bucket (`books`):**
   - Public read access for files under `published/`.
   - Authenticated author write access to `{user_id}/{book_id}.html`.
   - Maximum upload file size: 5 MiB (`5242880` bytes).
   - Content type restricted to `text/html`.
