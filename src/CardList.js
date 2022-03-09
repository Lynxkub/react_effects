import React,{useState , useEffect , useRef} from 'react';
import Card from './Card';
import axios from 'axios';
import uuid from 'react-uuid';



const CardList = () => {

const url = 'http://deckofcardsapi.com/api/deck';


const [autoDraw , setAutoDraw] = useState(false);
const timerRef = useRef(null);
const [cards , setCards] = useState([]);
// const [deckId , setDeckId] = useState([{
//     deck_id : 'new',
//     remaining : ""
// }])

const [deck , setDeck] = useState(null);





const handleAutoDraw = () => {
    setAutoDraw(autoDraw  => !autoDraw);
}

useEffect( () => {
    async function getDeck() {
        let d = await axios.get(`${url}/new/shuffle`);
        setDeck(d.data)
    }
    getDeck();
} , [setDeck])

useEffect( () => {
    async function getCard() {
        let { deck_id } = deck;
        
        try{
            let drawRes = await axios.get(`${url}/${deck_id}/draw/`);
            
            if(drawRes.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error('no cards remaining');
            }
            const card = drawRes.data.cards[0];

            setCards(c => [
                ...c, {
               image : card.image
                }
            ]);

        }catch (err) {
            alert(err);
        }
    }

    if(autoDraw && !timerRef.current) {
        timerRef.current = setInterval(async () => {
            await getCard();
        } , 1000);
    }

    return () => {
        clearInterval(timerRef.current);
        timerRef.current=null
    }
} , [autoDraw , setAutoDraw , deck])








// const handleCardDraw = async () => {
    
//     const res = await axios.get(`${url}/${deckId[0].deck_id}/draw/?count=1`)
   
//     setDeckId([{
//         deck_id : res.data.deck_id,
//         remaining : res.data.remaining
//     }])
//     deckId[0].remaining === 0 ? alert('Error: No Cards Remaining') :
//     setCards(cards => [...cards , {image : res.data.cards[0].image , id : uuid()}])
    
// }






 
return(
    <div>
        <button onClick = {handleAutoDraw}>Draw a card</button>
      
        <div>
        {cards.map(card => <Card cardImage = {card.image} key = {card.id}/>)}
        </div>
    </div>
)

}


export default CardList;
