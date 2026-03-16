-- ============================================================================
-- OmnicoreX Dashboard — Storage Configuration
-- Version: 005
-- Description: Create and configure Supabase Storage buckets
-- ============================================================================

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Create project-assets bucket (public, for project files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, owner, created_at, updated_at)
VALUES (
  'project-assets',
  'project-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create agent-outputs bucket (private, for agent outputs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, owner, created_at, updated_at)
VALUES (
  'agent-outputs',
  'agent-outputs',
  false,
  52428800, -- 50MB limit
  ARRAY['application/json', 'text/plain', 'text/csv', 'application/pdf', 'image/png', 'image/jpeg'],
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create client-documents bucket (private, for client files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, owner, created_at, updated_at)
VALUES (
  'client-documents',
  'client-documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'],
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: project-assets bucket - public read, authenticated write
CREATE POLICY "Public Read Access to project-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-assets');

CREATE POLICY "Authenticated Upload to project-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "Authenticated Update project-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-assets')
  WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "Authenticated Delete from project-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-assets');

-- Policy: agent-outputs bucket - authenticated only
CREATE POLICY "Authenticated Read agent-outputs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'agent-outputs');

CREATE POLICY "Authenticated Upload to agent-outputs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'agent-outputs');

CREATE POLICY "Authenticated Update agent-outputs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'agent-outputs')
  WITH CHECK (bucket_id = 'agent-outputs');

CREATE POLICY "Authenticated Delete from agent-outputs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'agent-outputs');

-- Policy: client-documents bucket - authenticated only
CREATE POLICY "Authenticated Read client-documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'client-documents');

CREATE POLICY "Authenticated Upload to client-documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-documents');

CREATE POLICY "Authenticated Update client-documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'client-documents')
  WITH CHECK (bucket_id = 'client-documents');

CREATE POLICY "Authenticated Delete from client-documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'client-documents');
