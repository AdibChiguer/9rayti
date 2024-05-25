// userAuth.tsx
import { useSelector } from 'react-redux';

export default function useAuth() {
  const user = useSelector((state: any) => state.auth.user);

  if(user !== '') {
    return true;
  } else {
    return false;
  }
}