
const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);
const table = base('coffee-stores')

const getMinifiedRecord = (record) => {
    return {
        recordId : record.id,
        ...record.fields,
    };
};

const getMinifiedRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record));
};

const findRecordByfilter = async (id) => {

    const findRecord = await table.select({
        filterByFormula : `id="${id}"`
    }).firstPage(); 

    return getMinifiedRecords(findRecord);
}

export {table, getMinifiedRecords, findRecordByfilter};