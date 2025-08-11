// ProtectedRoute.tsx
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** optional: require an 'admin' custom claim or similar */
  requireClaim?: string; // e.g., 'admin'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireClaim }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const redirectedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      // Not logged in → kick to /admin (replace so Back can't return)
      if (!user) {
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          navigate('/admin', { replace: true, state: { from: location } });
        }
        setIsLoading(false);
        return;
      }

      // Optional: enforce a custom claim (defense-in-depth)
      if (requireClaim) {
        try {
          const token = await getIdTokenResult(user, true);
          if (!token.claims?.[requireClaim]) {
            // Not authorized → sign out and redirect
            await auth.signOut();
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              navigate('/admin', { replace: true });
            }
            setIsLoading(false);
            return;
          }
        } catch {
          // Any error → fail closed
          await auth.signOut();
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            navigate('/admin', { replace: true });
          }
          setIsLoading(false);
          return;
        }
      }

      // Auth OK
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [navigate, location, requireClaim]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
