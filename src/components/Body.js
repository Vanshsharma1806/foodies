import Card , {CardWithOneBenifits} from "./Card";
import  React, { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { RES_API } from "../utils/constants";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Body = ()=>{

    const {user} = useAuth();
    const [resData , setResData] = useState([]);
    const [filteredList , setFilteredList] = useState(resData);
    const [isFiltered ,  setIsFiltered] = useState(false);
    const [searchValue , setSearchValue] = useState("");
    const CardWithBenifits = CardWithOneBenifits(Card);

    useEffect(()=>{
       fetchData();
    }, []);

    const fetchData = async ()=>{
        try{
            const data = await fetch(RES_API, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                 },
            });
            const json = await data.json();
            setResData(json);
            setFilteredList(json);
            console.log(json);
        }catch(err){
            console.error("Error fetching restaurants :" , err);
        }
    }
    
    const filter = ()=>{
        if(!isFiltered){
            setFilteredList(resData.filter((el) => el.avgRating>4.4))
            setIsFiltered(true);
        }else{
            setFilteredList(resData)
            setIsFiltered(false);
        }
    }
  
    if(filteredList.length === 0){
        return (
            <div className="mt-6">
                <div className="buttons flex items-center m-2  bg-gray-200 ">
                    <button className="filter-btn mx-2 bg-gray-300 rounded-xl w-20 " onClick={filter} >
                        {!isFiltered ? "Top ⭐" : "see all" }
                    </button>

                    <div className="search">
                        <input className="input  bg-white border border-black rounded-md px-2" type="text" value={searchValue}  onChange={(e)=>{
                            setSearchValue(e.target.value);
                        }}></input>
                        <button className="search-btn mx-2 bg-gray-300 rounded-xl w-20"  onClick={()=>{
                            const filteredRes = resData.filter((res)=> 
                                res.name.toLowerCase().includes(searchValue.toLowerCase())
                            )
                            setFilteredList(filteredRes);
                        }} >search</button>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <Shimmer/>
                </div>
            </div>

        );
    }

    
    return (
        <div className="Body mt-6" >
            <div className="buttons flex items-center m-2   ">
                <button className="filter-btn mx-2 bg-gray-300 rounded-xl w-20  " onClick={filter} >
                    {!isFiltered ? "Top ⭐" : "see all" }
                </button>

                <div className="search mx-2">
                    <input className="input border border-black rounded-md px-2" type="text" value={searchValue}  onChange={(e)=>{
                        setSearchValue(e.target.value);
                    }}></input>
                    <button className="search-btn mx-2 bg-gray-300 rounded-xl w-20"  onClick={()=>{
                        const filteredRes = resData.filter((res)=> 
                            res.name.toLowerCase().includes(searchValue.toLowerCase())
                        )
                        setFilteredList(filteredRes)
                    }} >search</button>
                </div>
            </div>
            <div className="res-container flex flex-wrap ">
                {filteredList?.map((res) => {
                    return (
                        <Link key={ res?.id} className="click-res" to={"/restaurant/" + res?.id}>
                            {
                                res?.veg ?
                                 <CardWithBenifits key ={res?.id} resdata = {res} /> :
                                  <Card key ={res?.id} resdata = {res} />
                            }
                        </Link>
                    )
                })}
            </div>
        </div>
        
    );
};

export default Body;