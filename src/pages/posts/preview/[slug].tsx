import Head from "next/head";
import { GetStaticProps } from "next";

import { RichText } from "prismic-dom";
import React, { useEffect } from "react";
import { getPrismicClient } from "../../../service/prismic";

import styles from '../post.module.scss';
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";

type PostRequest = {
    post: {
        slug: string;
        title: string;
        content: string;
        updated: string;
    }
}


export default function Post({ post }: PostRequest) {
    const [session] = useSession();
    const router = useRouter();
    
    useEffect(()=>{
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session])
    
    
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updated}</time>
                    <div
                        className={`${styles.postContent} ${styles.preview}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}/>
                    <div className={styles.continuosReading}>
                        Wanna continue reading?  
                        <Link href='/'>
                            <a>Subscribe now!!</a>
                        </Link>
                    </div>

                </article>
            </main>
        </>
    );
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 2)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        props: {
            post,
        },
        redirect: 60 * 30 // 30 minutes
    };


}