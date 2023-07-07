import { useRouter } from "next/router"
import Link from "next/link";
import coffeeStoresData from '../../data/coffee-stores.json'
import Head from "next/head";
import Image from "next/image";
import styles from '../../styles/coffee-store.module.css'
import cls from "classnames"
import fetchStoreData from "@/lib/coffee-stores";
import { isEmpty } from "@/utils";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/store/store-context";

export const getStaticProps = async (statisProps) => {
    const params = statisProps.params;

    const coffeeStores = await fetchStoreData()
    const findCoffeeStoreById = coffeeStores.find(
        (CoffeeStore) => {
            return CoffeeStore.id.toString() === params.id; 
        }
    )
    return { props: { CoffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}  } };
}

export const getStaticPaths = async () => {
    const coffeeStores = await fetchStoreData()
    const paths = coffeeStores.map((CoffeeStore) => {
        return {
            params : {
                id: CoffeeStore.id.toString() 
            }
        }
    });
    return {
        paths,
        fallback : true
    };
}

const handleUpvoteButton = () => {
    console.log('upvote button')
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();
    
    if (router.isFallback){
        <div>Loading....</div>
    }

    const id = router.query.id;

    const [CoffeeStore, setCoffeeStore] = useState(initialProps.CoffeeStore)
    const {state : {coffeeStores}} = useContext(StoreContext);

    useEffect(() => {
        if(isEmpty(initialProps.CoffeeStore)){
            if(coffeeStores.length > 0){
                const findCoffeeStoreById = coffeeStores.find(
                (CoffeeStore) => {
                    return CoffeeStore.id.toString() === id; 
                });
                setCoffeeStore(findCoffeeStoreById)
            }
        }
    },[id])
    const {name, address, imgUrl} = CoffeeStore;
    return( 
    <div className={styles.layout}>
        <Head>
            <title>{name}</title>
            <meta name="description" content={`${name} coffee store`} />
        </Head>
        <div className={styles.container}>
            <div className={styles.col1}>
                <div className={styles.backToHomeLink}>
                    <Link href='/'>
                        ⬅️ Back to home
                    </Link>
                </div>               
                <div className={styles.nameWrapper}>
                    <h1 className={styles.name}>{name}</h1>
                </div>              
                <Image src={imgUrl || 
                  "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} 
                  width={600} 
                  height={360}
                  className={styles.storeImg} 
                  alt={name}>
                </Image>
            </div>
            <div className={cls("glass",styles.col2)}>
                <div className={styles.iconWrapper}>
                    <Image src="../../icons/location.svg" width={24} height={24}></Image>
                    <p className={styles.text}>{address}</p>   
                </div>
                <div className={styles.iconWrapper}>
                    <Image src="../../icons/star.svg" width={24} height={24}></Image>
                    <p className={styles.text}>1</p>   
                </div>     
                <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
                    Up Vote!
                </button>
            </div>
        </div>       
    </div>
    );
}

export default CoffeeStore