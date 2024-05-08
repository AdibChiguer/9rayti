// userAuth.tsx
import { useSelector } from 'react-redux';

export default function useAuth() {
  const user = useSelector((state: any) => state.auth.user);

  if(user !== '') {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
}