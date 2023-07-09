import { table, getMinifiedRecords, findRecordByfilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) =>{
    if (req.method === 'POST'){
        const {id, name, address, imgUrl, upVoting} = req.body
    try {      
        if (id){
            const records = await findRecordByfilter(id)
            if(records.length > 0){
                res.status(200);
                res.json(records)
            } else {
                if(name){
                    const response = await table.create([
                    {
                        "fields": {
                        upVoting,
                        id,
                        name,
                        address,
                        imgUrl
                        }
                    }
                    ]);
                    const record = getMinifiedRecords(response)
                    res.status(200)
                    res.json(record)
                }else{
                    res.status(400);
                    res.json({"message": "Name is missing"})
                }
            }
        }else{
            res.status(400);
            res.json({"message": "Id is missing"})
        }                  
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.json({message: 'Something went wrong', err})
        }
    }
};

export default createCoffeeStore;
