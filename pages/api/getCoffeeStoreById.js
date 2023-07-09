import { table, getMinifiedRecords,findRecordByfilter } from "@/lib/airtable";

const getCoffeeStoreById = async (req, res) =>{
    try{
        const id = req.query.id;
        if(id){
            const records = await findRecordByfilter(id)
            if(records.length > 0){
                res.status(200);
                res.json(records)  
            }
            else{
                res.status(400);
                res.json("Id is not present")
            }
        }
        else{
            res.status(500);
            res.json({message: 'ID is missing'})
        }
    }
    catch(err){
        res.status(500);
        res.json({message: "Something went wrong",err})
        console.log(err)
    }
}

export default getCoffeeStoreById;