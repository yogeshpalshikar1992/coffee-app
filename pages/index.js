import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/card'
// import coffeeStores from '../data/coffee-stores.json'
import fetchStoreData from '@/lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/store-context'

const inter = Inter({ subsets: ['latin'] })
export const getStaticProps = async () => {
  const coffeeStores = await fetchStoreData() 
  return { props: { coffeeStores, } }
}

export default function Home(props) {

  const {handleTrackLocation, locationErrorMsg, isLoading} = useTrackLocation();
  // const [userCoffeeStores, setUserCoffeeStores] = useState("");
  const [errorCoffeeStore, setErrorCoffeeStore] = useState(null);

  const {dispatch, state} = useContext(StoreContext);
  const {coffeeStores, latLong} = state;

  useEffect( () => {
    async function setCoffeeStoresByLocation(){
      if(latLong){
        try{
          // const fetchCoffeeStore = await fetchStoreData(latLong,30)
          const response = await fetch(`api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`)
          const coffeeStores = await response.json();
          // console.log(coffeeStores);
          // console.log({fetchCoffeeStore})
          // setUserCoffeeStores(fetchCoffeeStore)  
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload : {coffeeStores}
          });   
          setErrorCoffeeStore("")    
        }
        catch(error){
          console.log(error)
          setErrorCoffeeStore(error.message)
        }
      }
    }
    setCoffeeStoresByLocation();
  },[latLong, dispatch])  
  
  const handleOnBannerBtnClick = () =>{
    // console.log('Hi button clicked')
    // console.log(latLong)
    handleTrackLocation();
  }

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="discover coffee stores nearby" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div>
          <Banner buttonText={isLoading ? "Locating..." : "View stores nearby"} handleOnclick={handleOnBannerBtnClick}/>
        </div>
        {locationErrorMsg && <p>Something went wrong : {locationErrorMsg}</p>}
        {errorCoffeeStore && <p>Something went wrong : {errorCoffeeStore}</p>}
        <div className={styles.heroImage}>
          <Image src='/static/hero-image1.png' width={600} height={400} alt='This is hero image'></Image>
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}> Coffee Stores Near Me</h2> 
          <div className={styles.cardLayout}>
          {
            coffeeStores.map((coffeeStore) => {
              return (
                <Card key={coffeeStore.id}
                  className={styles.card}
                  name={coffeeStore.name} 
                  imgUrl={coffeeStore.imgUrl || 
                  "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} 
                  href={`/coffee-store/${coffeeStore.id}` } alt={coffeeStore.name}>     
                </Card>
              )
            })
          }          
          </div>
          </div>
          )} 
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}> Pune Coffee Stores</h2> 
          <div className={styles.cardLayout}>
          {
            props.coffeeStores.map((coffeestore) => {
              return (
                <Card key={coffeestore.id}
                  className={styles.card}
                  name={coffeestore.name} 
                  imgUrl={coffeestore.imgUrl || 
                  "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} 
                  href={`/coffee-store/${coffeestore.id}`} alt={coffeestore.name}>     
                </Card>
              )
            })
          }          
          </div>
          </div>
          )} 
      </main>
    </>
  )
}
