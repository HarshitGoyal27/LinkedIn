const puppeteer = require('puppeteer');
const axios=require('axios');
const postsData = require('./profile'); // Import the postsData module
const fs=require('fs');
let posts;
const fun=async() => {
  try{
    const browser = await puppeteer.launch({ headless: false,args:['--start-maximized'],defaultViewport:null});
    const pageArr = await browser.pages();
    const page=pageArr[0];
    await page.goto('https://www.linkedin.com/login');
    await page.type('#username','9876175999');
    await page.type('#password','/)H_GU9M7h$fpU4');
    await page.click('button[aria-label="Sign in"]');
    await page.waitForTimeout(10000);
    await page.waitForSelector('input[placeholder="Search"]');
    await page.type('input[placeholder="Search"]', '#hiring #sap');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    //EXTRACTING POSTS
    // posts = await page.$('.reusable-search__result-container .mb3');
    // postsData.setPosts(posts);
    filterData(page,browser);  
    //scrollDownToEnd(page);   
    }
  catch(err){
    console.log('Some Problem is their:::::',err);
  }
}
const filterData=async(page,browser)=>{
    try{
        await page.waitForSelector('.mr2>button');
        await page.click('.mr2>button');
        await page.waitForSelector("#artdeco-modal-outlet input[value='date_posted']");
        await page.waitForSelector('#artdeco-modal-outlet input[value="past-24h"]');
        await page.evaluate(() => {
          document.querySelector("#artdeco-modal-outlet input[value='date_posted']").click();
          document.querySelector("#artdeco-modal-outlet input[value='past-24h']").click();
          document.querySelector("#artdeco-modal-outlet .mh2 button[type]").click();
        });      
        //correctly working till here
        getLatestPosts(page,browser);
         
    }catch(err){
        console.log('Something is wrong',err);
    }
}
const getLatestPosts=async(page,browser)=>{
  let cnt=0;
  try{
    await page.waitForTimeout(1000);
    await page.waitForSelector('.scaffold-finite-scroll__content');
    let postContainer=await page.$('.scaffold-finite-scroll__content');//we have to scroll down and get div
    let postArrDiv=await postContainer.$$('.scaffold-finite-scroll__content>div');//always length is 2 at the starting and them  increase after scroll down
    if(cnt===0){scrapPostData(page,browser,postArrDiv[0]);}
    else{
      scrapPostData(page,browser,postArrDiv[postArrDiv.length-1]);
    }
  }catch(err){
    console.log('error',err);
  }
}
async function scrollDownToEnd(page,browser) {
  let previousHeight = await page.evaluate(()=>{return document.body.scrollHeight});
  let currentHeight=previousHeight;
  console.log('previous hight',previousHeight);
  while (true) {
    await page.evaluate(()=>{window.scrollTo(0, document.body.scrollHeight)});//scrolls to end of the page
    console.log('Line 1');
    await page.waitForTimeout(6000); // Adjust the timeout if needed
    currentHeight = await page.evaluate(()=>{return document.body.scrollHeight});
    console.log('current/previos height',currentHeight,previousHeight);
    if (currentHeight === previousHeight) {
      // If the height doesn't change, you've reached the end of the page
      console.log('FINISHED');
      break;
    }
    getLatestPosts(page,browser);
    previousHeight=currentHeight;
  }
}
async function scrapPostData(page,browser,postDiv){//scrap data into JSON format
  await page.waitForTimeout(1000);
  let arr_li = await postDiv.$$('.scaffold-finite-scroll__content>div>div>ul>li>div>div[class="full-height"]');
  console.log(arr_li);
  console.log(arr_li.length);
  
  scrollDownToEnd(page,browser);
}

module.exports={
  fun:fun,
}
