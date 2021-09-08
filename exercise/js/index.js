const URL = "http://localhost:3000/tweets";
let next_url=null;
/**
 * Retrive Twitter Data from API
 */
const onNext=()=>
{  console.log(next_url);
    if(next_url!=null)
    {
        getTwitterData(true);
    }
}
const onEnter=(e)=>{
    if(e.key=="Enter")
    getTwitterData();
}
const getTwitterData = (next_page=false) =>
{   const search_query=encodeURIComponent(document.getElementById("user-search-input").value);
     if(!search_query)
     return;
    console.log(search_query);
    let url=`http://localhost:3000/tweets?q=${search_query}&count=10`
    if(next_page&&next_url)
    {
        url=`${URL}${next_url}`;
    }
    const promise=fetch(url); 
    promise.then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data.statuses);
       buildTweets(data.statuses,next_page);
       saveNextPage(data.search_metadata);
       nextPageButtonVisibility(data.search_metadata);
    }).catch((error)=>{
        console.log(error);
    })
}

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => 
{
    if(metadata.next_results)
    {
        next_url=metadata.next_results
    }
    else
    {
        next_url=null;
    }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => 
{
    const text=e.innerText;
    document.getElementById("user-search-input").value=text;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => 
{
    if(metadata.next_results)
    {
        document.getElementById("next-Page-Id").style.visibility="visible";
    }
    else{
        document.getElementById("next-Page-Id").style.visibility="hidden";
    }
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => 
{    let tweet_data="";
    //  const tweet_list=tweets.map((tweet)=>
    //  {   
    //        return tweet.full_text;
    //  });
     for(data of tweets)
     {
        tweet_data+=` <div class="tweet-container">
        <div class="tweet-user-info">
            <div class="tweet-user-profile" style="background-image:url(${data.user.profile_image_url_https});background-position:center;background-size:cover;">
            </div>
            <div class="tweet-username-container">
                <div class="tweet-user-fullname">
                  ${data.user.name}
                </div>
                <div class="tweet-user-username">
                @${data.user.screen_name}
                </div>
            </div>
        </div>`

        if(data.extended_entities&&data.extended_entities.media.length>0)
        {  console.log("entered");
            tweet_data+=buildImages(data.extended_entities.media);
            tweet_data+=buildVideo(data.extended_entities.media);
        }
       tweet_data+=`<div class="tweet-text-container">
           ${data.full_text}
        </div>
        <div class="tweet-date">
          ${moment(data.created_at).fromNow()}
        </div>
       </div>
      </div>` 
     }
     if(nextPage)
     document.querySelector('.tweet-list').insertAdjacentHTML('beforeend',tweet_data);
     else
     document.querySelector('.tweet-list').innerHTML=tweet_data;
}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => 
{  console.log(mediaList);
      let image_data=`<div class="tweet-images-container">`
      media_exist=false;
      for(media of mediaList)
      {
          if(media.type=="photo")
          {
              media_exist=true;
              image_data+=` <div class="tweet-image" style=background-image:url(${media.media_url_https});></div>`
          }
      }
      image_data+=`</div>`
      if(!media_exist)
      return "";
      return image_data;
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => 
{ 
    let video_data=`<div class="tweet-videos-container">`
      media_exist=false;
      for(media of mediaList)
      {
          if(media.type=="video")
          {  
              media_exist=true;
              video_data+=`<video controls><source src=${media.video_info.variants[0].url}></video>`
          }
          else if(media.type=="animated_gif")
          {
            media_exist=true;
            video_data+=`<video loop autoplay><source src=${media.video_info.variants[0].url}></video>`
          }
      }
      video_data+=`</div>`
      if(!media_exist)
      return "";
      return video_data;
}
