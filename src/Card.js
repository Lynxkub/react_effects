import React from 'react';


const Card = ( { cardImage , key}) => {

    return (
        <img src = {cardImage} key = {key} alt = 'card'/>
    )
}

export default Card;