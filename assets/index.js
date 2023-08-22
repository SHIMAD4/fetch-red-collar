const URL = "https://dummyjson.com/comments"

async function getData(url) {
    const data = await fetch(url).then(response => response.json())
    return data
}

async function app(url) {
    const commentsData = await getData(url)
    const visibleRows = 10
    let currentPage = 1
    let i = 0
    
    function displayList(arrayData, rowPerPage, page) {
        const contentBlock = document.querySelector('.content')
        contentBlock.innerHTML = ''

        page--
        const startSlicePos = rowPerPage * page
        const endSlicePos = startSlicePos + rowPerPage

        const slicedArrayData = arrayData.slice(startSlicePos, endSlicePos)

        slicedArrayData.forEach(element => {
            const list = document.createElement('ul')
            const listItemText = document.createElement('li')
            const listItemUsername = document.createElement('li')

            list.classList.add('comment')
            listItemText.classList.add('comment__text')
            listItemUsername.classList.add('comment__user')

            listItemText.innerText = element.body
            listItemUsername.innerText = element.user.username

            list.appendChild(listItemText)
            list.appendChild(listItemUsername)
            contentBlock.appendChild(list)
        })

        let count = document.querySelector('.info span')
        let targets = document.querySelectorAll('.comment')
        let options = {
            threshold: 1,
        }
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    count.innerText = ++i
                    observer.unobserve(entry.target)
                }
            })
        }, options)
        if(targets) {
            targets.forEach(element => {
                observer.observe(element)
            })
        }
    }

    function displayPagination(arrayData, rowPerPage) {
        const paginationBlock = document.querySelector('.pagination')
        const pagesCount = Math.ceil(arrayData.length / rowPerPage)

        for(let i = 0; i < pagesCount; i++) {
            const paginationCell = displayPaginationButton(i + 1)
            paginationBlock.appendChild(paginationCell)
        }
    }

    function displayPaginationButton(pageCount) {
        const paginationCell = document.createElement('li')
        paginationCell.classList.add('pagination__cell')
        paginationCell.innerText = pageCount
        
        if(currentPage === pageCount) {
            paginationCell.classList.add('active')
        }

        paginationCell.addEventListener('click', () => {
            let currentPaginationCell = document.querySelector('li.active')
            currentPaginationCell.classList.remove('active')
            paginationCell.classList.add('active')

            currentPage = pageCount
            displayList(commentsData.comments, visibleRows, currentPage)
            window.scrollTo(0, 0)
        })

        return paginationCell
    }

    displayList(commentsData.comments, visibleRows, currentPage)
    displayPagination(commentsData.comments, visibleRows)
}

app(URL)