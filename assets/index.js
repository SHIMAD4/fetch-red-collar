// Адрес API
const URL = "https://dummyjson.com/comments"

// Функция для забора данных с API (Принимает адрес API)
async function getData(url) {
    const data = await fetch(url).then(response => response.json())
    return data
}

// Функция основного приложения (Принимает адрес API)
async function app(url) {
    const commentsData = await getData(url)    // Объект с данными (Комментарии)
    let currentDisplayPos = 0                  // Переменная для отслеживания текущей позиции среза массива
    let visibleRows = 0                        // Переменная для вывода наччальных строк
    let i = 0                                  // Переменная для счетчика просмотренных комментариев

    // Переменная для отслеживания пересечений
    const observer = new IntersectionObserver((entries, observer) => {
        const countViewedComments = document.querySelector('.info span')    // Переменная для захвата тега с счетчиком
        entries.forEach(entry => {                                          // Цикл для каждого елемента entry в массиве entries
            if (entry.isIntersecting) {                                     // Проверка на совпадение отслеживания
                entry.target.classList.add('observed')                      // Добавление класса для коммента
                countViewedComments.innerText = ++i                         // Прибавление к счетчику
                observer.unobserve(entry.target)                            // Снятие слежки за комментом
            }
        })
    }, {
        // Настройки observer
        // Установлено значение просмотра с которого засчитывается +1 к счетчику
        threshold: 1,
    })

    // Функция для отрисовки массива комментов (Принимает массив данных и число начальной отрисовки)
    function displayList(arrayData, rowPerPage) {
        const startSlicePos = currentDisplayPos                                // Начальная позиция среза массива
        const endSlicePos = currentDisplayPos + rowPerPage                     // Конечная позиция среза массива

        const slicedArrayData = arrayData.slice(startSlicePos, endSlicePos)    // Срезанный массив данных для отрисовки

        // Для каждого элемента из срезанного массива
        slicedArrayData.forEach(element => {
            createList(element.id, element.body, element.user.username)        // Вызывается функция создания блока с наполнением
        })

        currentDisplayPos += rowPerPage // Обновление текущей позиции среза массива
    }

    // Функция для отрисовки кнопки пагинации
    function createPaginationButton() {
        const paginationBlock = document.querySelector('.pagination')                  // Блок где лежит кнопка
        
        const paginationButton = document.createElement('button')                      // Создание кнопки
        paginationButton.classList.add('pagination__button')                           // Добавление класса кнопке
        paginationButton.innerText = 'Load more'                                       // Добавление текста внутри кнопки
        
        paginationBlock.appendChild(paginationButton)                                  // Операция вставки кнопки в блок

        // Назначается слушатель по клику
        paginationButton.addEventListener('click', () => {
            let arrayCommentsLength = document.querySelectorAll('.comment').length    // Вычисляется длина массива отрисованных комментов
            
            if (arrayCommentsLength === commentsData.limit) {                         // Условие: Если длина отрисованного массива равна длине массива из API
                paginationButton.setAttribute('disabled', 'disabled')                 // То добавляем атрибут disabled для кнопки
            }else {
                displayList(commentsData.comments, visibleRows + 5)                   // Иначе: отрисовываем новые комментарии
            }
        })

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

        if (!list.classList.contains('observed')) {                // Условие: Если блок комментария не содержит класс observed
            observer.observe(list)                                 // то мы его отсллеживаем
        }

        contentBlock.appendChild(list)                             // Вставка блока комментария в общий блок
    }

    displayList(commentsData.comments, visibleRows + 10)
    createPaginationButton()
}

app(URL)
