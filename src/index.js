document.addEventListener('DOMContentLoaded',()=>{
    const gameList = document.getElementById("game-list");
    const gameImage = document.querySelector('.image');
    const gameDescription = document.querySelector('.description');
    const searchInput =document.getElementById('search-input')
    const searchButton = document.getElementById('search-button');

    let currentGame = null;
    let gamesData = [];
    
    
    
    function showGameDetails(game){
        gameImage.innerHTML = `<img src="${game.thumb}" alt="${game.title} Image" width="300">`;

        const imgElement = gameImage.querySelector('img');
        imgElement.addEventListener("click",()=>{
            imgElement.style.display='none'

            setTimeout(()=>{
                imgElement.style.display='block'
            },5000);
        })


        gameDescription.innerHTML = `
        Game Id:${game.gameID} 

        Date Released:${new Date(game.releaseDate*1000).toLocaleDateString()} 
        RatinginText:${game.steamRatingText}
        Ratinginpercentage:${game.steamRatingPercent}%
        Price:$${parseFloat(game.normalPrice).toFixed(2)}

        `;
    }


    function getGameList(){
        gameList.innerHTML = '';

        gamesData.forEach((game)=>{
            const li = document.createElement("li");
            li.textContent = game.title;

            li.addEventListener('click',()=>{
                currentGame = gamesData.find(games=>games.title===li.textContent);
                showGameDetails(currentGame);

            });
            gameList.appendChild(li);
        })
    };
    function searchGames(){
        const searchTerm =searchInput.value.trim().toLowerCase();
        if(searchTerm===''){
            return;
        }
        const filteredGames=gamesData.filter(game=>{
            return(
                game.title.toLowerCase().includes(searchTerm)||
                game.gameID.toLowerCase().includes(searchTerm)
            );

        });
        if(filteredGames.length>0){
            currentGame=filteredGames[0];
            showGameDetails(currentGame);
        }else{
            alert('No matching games found');
        }
    } 
    fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15')
    .then((response) =>{
        if(!response.ok){
            throw new error("response not ok");
        }
        return response.json();
    })
    .then((data)=>{
        if(Array.isArray(data)){
            gamesData = data;

            if(data.length > 0){
                currentGame = data[0];
                showGameDetails(currentGame);
            }

            getGameList();
        }
    }) 
    // add eventlistener to the search Button.
    searchButton.addEventListener('click',()=>{
        searchGames();
    });
    
    function submitComment(event) {
        event.preventDefault(); 
      
        // Get form values
        const name = document.getElementById('fname').value;
        const comment = document.getElementById('comment').value;
      
        // Create an object to represent the comment
        const newComment = {
          name,
          comment,
          // Add timestamp for each comment
          timestamp: new Date().toLocaleString() 
      };
      
      // Clear form fields after submission
      document.getElementById('fname').value = '';
      document.getElementById('comment').value = '';
      
      // Display the submitted comment in the commentsList div
      
      const commentItem = document.createElement('div');
      commentItem.innerHTML = `
         
      ${newComment.name}
      
         Commented: ${newComment.comment}
      
         Submitted at: ${newComment.timestamp}
      
      
      `;
      
      document.getElementById('commentsList').appendChild(commentItem);

      }
      submitComment(event);

      
      // Add event listener to handle form submission
    document.getElementById('submitComment').addEventListener('click', submitComment);


    

})
