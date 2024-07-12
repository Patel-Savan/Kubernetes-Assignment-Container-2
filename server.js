const express = require('express')
const csv = require('csv-parser')
const fs = require('fs')

const app = express()

app.listen(7000)

app.use(express.json())

app.post("/result",(req,res)=>{

    const body = req.body;

    const fileName = body.file;
    const productName = body.product;

    const filePath = "../Savan_PV_dir/" +  fileName;
    var sum = 0;
    var row = 0;
    var isCsvValid = true;

    const parser = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data',(data)=>{
            row++;

            if(data.product == null || data.amount == null){
                isCsvValid = false;
                parser.destroy(new Error("Input file not in CSV format."))
            }

            if(data.product == productName){
                const amount = parseInt(data.amount)

                if (!isNaN(amount)) {
                    sum += amount;
                } else {
                    isCsvValid = false;
                    parser.destroy(new Error("Input file not in CSV format."));
                }
            }
        })
        .on('end', () => {

            if(isCsvValid && row>0){
                const response = {
                    file: fileName,
                    sum: sum
                }
                res.json(response);
            }

            if(row == 0 ){
                console.log("Cannot read data")
                parser.destroy(new Error("Input file not in CSV format."))
            }
        })
        .on('error', (error) => {
            const errorResponse = {
                file : fileName,
                error:error.message
            }
            res.status(400).json(errorResponse);
        });
})