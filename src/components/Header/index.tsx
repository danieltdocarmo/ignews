import Link from 'next/link';

import styles from './style.module.scss';

import { SingInButton } from '../SingInButton';
import { HeaderLink } from '../HeaderLink';



export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <HeaderLink href="/" activeClassName={styles.active}>
                        <a>Home</a>
                    </HeaderLink>
                    <HeaderLink href="/posts" activeClassName={styles.active}>
                        <a >Posts</a>
                    </HeaderLink>
                </nav>

                <SingInButton />

            </div>


        </header>
    )
}