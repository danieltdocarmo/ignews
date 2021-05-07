import { signIn, useSession } from 'next-auth/client';
import styles from './style.module.scss';

import api from '../../service/api';
import { getStripeJs } from '../../service/stripe-js';

export function SubscribeButton(){
    const [session] = useSession(); 
    
    async function handleSubscribe(){
        if(!session){
            signIn();
            return;
        }

        try{
        
            const response = await api.post('/subscribe');
           
            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        
        }catch(err){
            alert(err.message);
        }
    
    
    }
    
    return(
        <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}