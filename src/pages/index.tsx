import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { 
  Layout,
  Login
} from '../components';
import { useAuth } from '../hooks/useAuth';

// user: 21aaa8a4-9217-4c6b-9cf2-4a10a0880d72@profranchising.com.br
// password: 0340f390-37d5-4047-a02a-4ba15bdfe39f

const Home: NextPage = () => {
  const page_router = useRouter();
  const { tokenIsValid } = useAuth();

  useEffect(() => {
    if(tokenIsValid) {
      page_router.push('/products');
    }
  }, []);

  return (
    <Layout
      headConfig={{
        title: 'iRecipe - Entrar na conta'
      }}
      >
      <Login />
    </Layout>
  )
}

export default Home
