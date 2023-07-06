import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getFetchUrl = (query, latlong, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
}

const getPhotsUrls = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30,
      });
    const unspalshResults = photos.response.results.map(
        (result) => result.urls["small"] 
    );
    return  unspalshResults; 
}

const fetchStoreData = async (latlong='18.672552%2C73.889366', limit=6) => {

    const photos = await getPhotsUrls();
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
      };
      
      const response = await fetch(
        getFetchUrl('coffee',latlong,limit), 
        options)
      const data = await response.json(); 
        // .catch(err => console.error(err));
      return data.results.map((result, idx) => {
        return {
            id: result.fsq_id,
            name: result.name,
            address : result.location.formatted_address,
            // neighbourhood : result.location.address_extended,
            imgUrl: photos.length > 0 ? photos[idx] : null,
        }
      }
      );  
}

export default fetchStoreData;