import styles from './style.module.scss';

import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import { signIn, signOut, useSession } from 'next-auth/client'

export function SingInButton(){
    const [session] = useSession();
    

    return session ? (
        <button 
        type="button" 
        className={styles.signInButton}
        onClick={()=>{signIn('github')}}>
            <FaGithub color="#04d361"/>
            {session.user.name}
            <FiX color="#737380" onClick={()=>{signOut()}} className={styles.closeIcon}/>
        </button>
    ) : (
        <button 
        type="button" 
        className={styles.signInButton}
        onClick={()=>{signIn('github')}}>
            <FaGithub color="#eba417"/>
            Sign in with button
        </button>
    )
}