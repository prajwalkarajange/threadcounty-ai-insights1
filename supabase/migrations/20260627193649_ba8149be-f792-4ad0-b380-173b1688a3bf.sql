
CREATE POLICY "Users read own fabric uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'fabric-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users insert own fabric uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'fabric-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own fabric uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'fabric-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
