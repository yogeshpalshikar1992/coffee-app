import { table, findRecordByfilter, getMinifiedRecords } from "@/lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
    try {
        const id = req.query.id;
        if (req.method === 'PUT'){
            if(id){
                const records = await findRecordByfilter(id)
                if(records.length > 0){
                    res.status(200)
                    res.json(records)
                    const record = records[0]
                    const calculateVoting = parseInt(record.upVoting) + parseInt(1);
                    console.log(calculateVoting)
                    const updatedRecord = table.update([
                        {
                            id:record.recordId,
                            fields: {
                                upVoting: calculateVoting
                            }
                        }
                    ]);
                    if (updatedRecord){
                        const minifiedRecord = getMinifiedRecords(updatedRecord)
                        res.status(200);
                        res.json(minifiedRecord)
                    }
                    } else {
                      res.status(400);
                      res.json({ message: "Coffee store id doesn't exist", id });
                    }
                }  
            else{
                res.status(400);
                res.json({"message": "Id is missing"})
            } 
        }       
    }
    catch(err) {
        res.status(500);
        res.json({ message: "Error upvoting coffee store", err });
    }
}
export default favouriteCoffeeStoreById;