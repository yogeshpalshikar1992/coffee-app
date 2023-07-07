import fetchStoreData from '@/lib/coffee-stores'

const getCoffeeStoreByLocation = async (req, res) => {
    try{
        const {latLong, limit} = req.query;
        const response = await fetchStoreData(latLong, limit); 
        res.status(200);
        res.json(response)
    }
    catch(err){
        console.log(err)
        res.status(500);
        res.json({message: 'Something went Wrong', err})
    }
}

export default getCoffeeStoreByLocation;