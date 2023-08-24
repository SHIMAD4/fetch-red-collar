// Функция для забора данных с API (Принимает адрес API)
async function getData(skip, limit) {
    let URL = "https://dummyjson.com/comments" + `?skip=${skip}&limit=${limit}`    // Адрес API с ограничениями (skip, limit)
    const data = await fetch(URL).then(response => response.json())                // Данные в формате json
    return data
}

// Функция основного приложения (Принимает адрес API)
async function app() {
    let commentsData = await getData(0, 5)    // Объект с данными (Комментарии)
    let tempSkip = 0                          // Количество комментов для пропуска
    const tempLimit = 5                       // Количество комментов для подгрузки
    const endComments = 25                    // Количество комментариев (30 - 5)

    // Переменная для отслеживания пересечений
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(async entry => {                                          // Цикл для каждого елемента entry в массиве entries
            if (tempSkip < endComments) {
                if (entry.isIntersecting) {                                       // Проверка на совпадение отслеживания
                        entry.target.classList.add('observed')                    // Добавление класса для блока
                        commentsData = await getData(tempSkip += 5, tempLimit)    // Вызов новых данных (tempSkip += 5, tempLimit)
                        displayList(commentsData.comments)                        // рендер новых данных
                    }
            } else {
                observer.unobserve(entry.target)                                  // Снятие слежки за блоком
                entry.target.classList.add('disabled')                            // Добавление стилей disabled
            }
        })
    }, {
        // Настройки observer
        // Установлено значение просмотра с которого засчитывается +1 к счетчику
        threshold: 1,
    })

    // Функция для отрисовки массива комментов (Принимает массив данных и число начальной отрисовки)
    function displayList(arrayData) {
        // Для каждого элемента из массива
        arrayData.forEach(element => {
            createList(element.id, element.body, element.user.username)    // Вызывается функция создания блока с наполнением
        })

    }

    // Функция для отрисовки кнопки пагинации
    function createPaginationButton() {
        const paginationBlock = document.querySelector('.pagination')    // Родительский блок

        const paginationButton = document.createElement('div')           // Создание блока
        paginationButton.classList.add('pagination__button')             // Добавление класса блоку

        const paginationText = document.createElement('p')               // Создание элемента текста в блоке
        paginationText.innerText = 'Loading...'                          // Добавление текста внутри блока

        paginationButton.appendChild(paginationText)                     // Операция вставки текста в блок
        paginationBlock.appendChild(paginationButton)                    // Операция вставки дочернего блока в родительский блок

        observer.observe(paginationButton)                               // Включение отслеживания для блока

        return paginationButton
    }

    // Функция для отрисовки комментариев и их наполнения (Принимает id коммента, Тело(текст), Имя пользователя)
    function createList(id, body, username) {
        const contentBlock = document.querySelector('.content')    // Забор блока где лежат комментарии

        const list = document.createElement('ul')                  // Создание блока комментария
        const listItemText = document.createElement('li')          // Создание элемента комментария где лежит его тело (текст)
        const listItemUsername = document.createElement('li')      // Создание элемента комментария где лежит имя пользователя

        list.classList.add('comment')                              // Доавление класса
        list.setAttribute('id', id)                                // Добавление id
        listItemText.classList.add('comment__text')                // Добавление класса для тела комментария
        listItemUsername.classList.add('comment__user')            // Добавление класса дял имени пользователя

        listItemText.innerText = body                              // Добавление текста в тело комментария
        listItemUsername.innerText = username                      // Добавление имени пользователя

        list.appendChild(listItemText)                             // Вставка тела в блок комментария
        list.appendChild(listItemUsername)                         // Вставка имени пользователя в блок комментария

        contentBlock.appendChild(list)                             // Вставка блока комментария в общий блок
    }

    displayList(commentsData.comments)
    createPaginationButton()
}

app()
