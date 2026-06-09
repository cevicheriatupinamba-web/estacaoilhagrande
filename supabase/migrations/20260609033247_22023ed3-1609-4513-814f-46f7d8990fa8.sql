
-- Allow anyone (anon + authenticated) to upload to anuncio-uploads under 'submissions/' prefix.
CREATE POLICY "Anyone can upload anuncio submissions"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'anuncio-uploads'
  AND (storage.foldername(name))[1] = 'submissions'
);

-- Allow reading own just-uploaded objects (needed by SDK to create signed URLs sometimes).
CREATE POLICY "Anyone can read anuncio submissions"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'anuncio-uploads'
  AND (storage.foldername(name))[1] = 'submissions'
);
