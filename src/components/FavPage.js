import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BeerPrev from './BeerPrev';

import axios from 'axios';
import { StoreContext } from '../App'
import { useObserver } from 'mobx-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function FavPage(props) {

  const store = React.useContext(StoreContext);
  const [favoriteBeers,setFavoriteBeers]=React.useState([]);
  const [foundBeers,setFoundBeers]=React.useState(true);

    
    useEffect(() => {
      store.updateStore();
      getBeers();
    },[0]);
    
    const getBeers = async() => {
      let ids=store.getFav;
      let idsString="";
      ids.forEach(id => {
        idsString=idsString+id+"|";
      });
      idsString = idsString.slice(0, -1);
      try{
          let beers = await axios.get(`https://api.punkapi.com/v2/beers`, {
            params: {
              ids: idsString
            }
          });
          beers=beers.data.map(v => ({...v,favorite:true}))
          setFavoriteBeers(beers);
          setFoundBeers(true);

         if(beers[0]==undefined) setFoundBeers(false);;
      }
      catch(err){
        setFoundBeers(false);
      }
    }

    const removeAll = () => {
      confirmAlert({
        title: 'Are you sure you want to remove all your favorites?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              store.empty();
              setFavoriteBeers([]);
            }
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
    }

    return useObserver(()=>(
      <div>
            <h1 style={{ fontFamily: "Comic Sans MS", color:'white' }}>Your Favorite Beers</h1>
            <Button onClick={removeAll} style={{  }} variant="primary">Remove all</Button>
            <br></br> 
            <br></br>

            {foundBeers && favoriteBeers.map(beer =>
              <BeerPrev key={beer.id} id={beer.id} img={beer.image_url} title={beer.name} fav={beer.favorite} rating={store.getRating(beer.id)}/>
            )}
            {!foundBeers &&
              <b><h1 style={{color:'rgba(255,255,255,0.4)',fontSize:'100px'}}>No results found</h1></b>

            }
        </div>
    ));
}
export default FavPage;

