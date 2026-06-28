DROP POLICY IF EXISTS "Admins view all uploads" ON public.uploads;
DROP POLICY IF EXISTS "Admins view all analysis" ON public.analysis_results;

CREATE POLICY "Admins view all uploads"
ON public.uploads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins view all analysis"
ON public.analysis_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::public.app_role
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;