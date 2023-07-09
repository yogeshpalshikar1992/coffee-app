import { useRouter } from "next/router"
import Link from "next/link";
// import coffeeStoresData from '../../data/coffee-stores.json'
import Head from "next/head";
import Image from "next/image";
import styles from '../../styles/coffee-store.module.css'
import cls from "classnames"
import fetchStoreData from "@/lib/coffee-stores";
import { isEmpty, fetcher } from "@/utils";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/store/store-context";
import useSWR from "swr";

export const getStaticProps = async (statisProps) => {
    const params = statisProps.params;

    const coffeeStores = await fetchStoreData()
    const findCoffeeStoreById = coffeeStores.find(
        (coffeeStore) => {
            return coffeeStore.id.toString() === params.id; 
        }
    )
    return { 
        props: { 
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}  
        } 
    };
}

export const getStaticPaths = async () => {
    const coffeeStores = await fetchStoreData()
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params : {
                id: coffeeStore.id.toString() 
            }
        }
    });
    return {
        paths,
        fallback : true
    };
}

const CoffeeStore = (props) => {
    const router = useRouter();
    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {})
    const {state : {coffeeStores}} = useContext(StoreContext);
    // console.log({coffeeStore})
    // console.log({coffeeStores})

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {id, name, address, imgUrl, upVoting} = coffeeStore;

            const response = await fetch("/api/createCoffeeStore",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    address,
                    imgUrl,
                    upVoting : 0
                })
            });
            const dbCoffeeStore = await response.json();
        }
        catch(err) {
            console.log("Error creating store", err)
        }
    }

    useEffect(() => {
        // console.log({id})
        if(isEmpty(props.coffeeStore)){
            if(coffeeStores.length > 0){
                const coffeeStoreFromContext = coffeeStores.find(
                (coffeeStore) => {
                    return coffeeStore.id.toString() === id; 
                });
                if(coffeeStoreFromContext){
                    setCoffeeStore(coffeeStoreFromContext)
                    handleCreateCoffeeStore(coffeeStoreFromContext)
                }              
            }
        }
        else{
            // console.log('inside else')
            // console.log(props.CoffeeStore)
            handleCreateCoffeeStore(props.coffeeStore)
        }
    },[id, props.coffeeStore, coffeeStores]);

    const [votingCount, setVotingCount] = useState(0);
    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, (url) => fetch(url).then(res => res.json()));

    useEffect(() => {
        console.log({data})
        if(data && data.length > 0){
            setCoffeeStore(data[0])
            setVotingCount(data[0].upVoting);
        }
    },[data]);

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const handleUpvoteButton = async () => {
        try {
            // const {id, name, address, imgUrl, upVoting} = coffeeStore;

            const response = await fetch(`/api/favouriteCoffeeStoreById?id=${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({
                //     id,
                //     name,
                //     address,
                //     imgUrl,
                //     upVoting : 0
                // })
            });
            const dbCoffeeStore = await response.json();
            if (dbCoffeeStore && dbCoffeeStore.length > 0){
                let count = votingCount + 1;
                setVotingCount(count);
            }
            console.log({dbCoffeeStore})
        }
        catch(err) {
            console.log("Error updating store", err)
        }
    }

    if(error){
        return <h1>Something went wrong while retrieving page</h1>
    }
    // console.log({CoffeeStore})
    const {name = "", address = "", imgUrl = "", upVoting=0} = coffeeStore;
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
                    <Image src="../../icons/location.svg" width={24} height={24} alt="icon"></Image>
                    <p className={styles.text}>{address}</p>   
                </div>
                <div className={styles.iconWrapper}>
                    <Image src="../../icons/star.svg" width={24} height={24} alt="icon"></Image>
                    <p className={styles.text}>{votingCount}</p>   
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