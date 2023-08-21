const URL = "https://dummyjson.com/comments"
const contentBlock = document.querySelector('.content')
const comment = document.querySelector('.comment')
const commentText = document.querySelector('.comment__text')
const commentUser = document.querySelector('.comment__user')

async function getData(url) {
    const data = await fetch(url).then(response => response.json())
    
    commentText.innerText = data.comments[0].body
    commentUser.innerText = data.comments[0].user.username
    console.log(data)
}

getData(URL)