const express = require("express");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");
const redisclient = redis.createClient();

const DEFAULT_EXPIRATION = 3900;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());


(async () => {
  try {
    await redisclient.connect();
    console.log("Redis has been connected");
  } catch (error) {
    console.log("Redis connection error:", error);
    throw error;
  }
})();


app.get("/photos", async (req, res) => {
  try {
    const cachedPhotos = await redisclient.get("/photos");
    if (cachedPhotos) {
      console.log("Returning cached data");
      return res.json(JSON.parse(cachedPhotos)); 
    }

    
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos");

    
    await redisclient.setEx("/photos", DEFAULT_EXPIRATION, JSON.stringify(data));

    
    res.json(data);

  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).send("Server Error");
  }
});


function catches(error,result){
    try{
            return new Promise((resolve,reject)=>{
                redisclient.get(key,(key,error)=>{
                if(error) return reject(error)
                    
                })
            })

    }
    catch(error){
        console.log("internel server error",error)
        throw error
    }
}



app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
