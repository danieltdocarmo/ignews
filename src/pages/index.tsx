import Head from 'next/head';


import styles from './home.module.scss';


import { SubscribeButton } from '../components/SubscribeButton';
import { GetServerSideProps } from 'next';
import { stripe } from '../service/stripe';


type HomeProps = {
  product: {
    priceId: string,
    amount: string
  }
}
export default function Home({product}: HomeProps) {
  
  return (
    <>
      <Head>
        <title>
          Home
        </title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, Welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>Get acess to all the publications <br/> for
          <span> {product.amount} month</span>
          </p>
          <SubscribeButton/>
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding"/>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async function (){
  
  
  const price = await stripe.prices.retrieve('price_1IeUtiKkOmc43SsqSlkN6uaM', {
    expand: ['product']
  })  
  
  const product = {
    priceId : price.id,
    amount: new Intl.NumberFormat(
      'en-US',{
        style: 'currency',
        currency: 'USD',
      }
    ).format((price.unit_amount / 100)),
  }

  
    return {
    props: {
      product
    }
  }
}