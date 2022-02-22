import type { NextPage } from 'next';

import { 
  Layout,
  Login
} from '../components';

// user: 21aaa8a4-9217-4c6b-9cf2-4a10a0880d72@profranchising.com.br
// password: 0340f390-37d5-4047-a02a-4ba15bdfe39f

const Home: NextPage = () => {

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
