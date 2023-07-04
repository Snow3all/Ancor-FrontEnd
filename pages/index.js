import AuthLayout from '../layouts/Auth';

const Home = () => {
  return (
    <div className='text-center'>
      test
    </div>
  )
}

Home.getLayout = (page) => (
  <AuthLayout>{page}</AuthLayout>
);

export default Home;