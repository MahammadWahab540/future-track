-- Grant owner access to gmdwahab@gmail.com
-- Note: This will work once the user signs up with this email

-- First, let's create a function to automatically grant owner role to this specific email
CREATE OR REPLACE FUNCTION public.grant_owner_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Grant owner role to specific email
  IF NEW.email = 'gmdwahab@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically grant owner role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_owner
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_owner_access();