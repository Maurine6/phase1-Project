document.addEventListener('DOMContentLoaded',()=>{
    // DOM elements
    const gameList = document.getElementById("game-list");
    const gameImage = document.querySelector('.image');
    const gameDescription = document.querySelector('.description');
    const searchInput =document.getElementById('search-input')
    const searchButton = document.getElementById('search-button');

    //variables to store data
    let currentGame =""; // store currentlty selected game
    let gamesData = []; //store game data
    
    
    //function to show games details.
    function showGameDetails(game){
        gameImage.innerHTML = `<img src="${game.thumb}" alt="${game.title} Image" width="300">`;

        const imgElement = gameImage.querySelector('img');
        // hide the game image for 5seconds when clicked.
        imgElement.addEventListener("click",()=>{
            imgElement.style.display='none'

            setTimeout(()=>{
                imgElement.style.display='block'
            },5000);
        })

        // display games description
        gameDescription.innerHTML = `
        Game Id:${game.gameID} 
        
        Date Released:${new Date(game.releaseDate*1000).toLocaleDateString()} 
        RatinginText:${game.steamRatingText}
        Ratinginpercentage:${game.steamRatingPercent}%
        Price:$${parseFloat(game.normalPrice).toFixed(2)}

        `;
    }

    //function to get the gamelist and update it.
    function getGameList(){
        gameList.innerHTML = '';
        // create and populate <li> elements
        gamesData.forEach((game)=>{
            const li = document.createElement("li");
            li.textContent = game.title;
            // add an event lisyener to the <li> elements.
            li.addEventListener('click',()=>{
                currentGame = gamesData.find(games=>games.title===li.textContent);
                showGameDetails(currentGame);

            });
            // append the <li> element to the gamelist
            gameList.appendChild(li);
        })
    };
    // function to search a game by title from the existing list.
    function searchGames(){
        // the input value to in lowercase.
        const searchTerm =searchInput.value.trim().toLowerCase();
        // check if the search term value is an empty string then return true
        if(searchTerm===''){
            return;
        }
        // filter the games list to return the search term
        const filteredGames=gamesData.filter(game=>{
            return(
                game.title.toLowerCase().includes(searchTerm)||
                game.gameID.toLowerCase().includes(searchTerm)
            );

        });
        //show the filtered game as the current game.
        if(filteredGames.length>0){
            currentGame=filteredGames[0];
            showGameDetails(currentGame);
        }else{
            alert('No matching games found');// if there's no game matching te searchterm, throw an alert.
        }
    }
    
    // make a get request to the API server when th content is loaded.
    fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15')
    .then((response) =>{
        if(!response.ok){
            throw new error("response not ok");
        }
        return response.json();
    })
    .then((data)=>{
        //check if the is an array of games
        if(Array.isArray(data)){
            //store games data
            gamesData = data;
            // show the first game by default when the page is loaded.
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
    
    // function tosubmit  user comment.
    function submitComment(event) {
        event.preventDefault(); // prevent events default behavior
      
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
      //append the <div> element to an element with an id of 'commentslist'
      document.getElementById('commentsList').appendChild(commentItem);

      }
      submitComment(event); // call the function

      
      // Add event listener to handle form submission
    document.getElementById('submitComment').addEventListener('click', submitComment);


    

})
