//Количество результатов (максимум — 20)
const maxCount = $('#daDataService').data('daData-maxCount') ? $('#daDataService').data('daData-maxCount') : 5

// На каком языке вернуть результат (ru / en)
const language = $('#daDataService').data('daData-lang') ? $('#daDataService').data('daData-lang') : 'ru'

//Родительский элемент
const parentDiv = $('#daDataBlock')

/**
 * Показывать данные по нажатию
 */
$('#daDataService')
  .on('keyup', async function () {
    let text = $(this).val()
    cleardaData()
    
    if (text != "") {
      let result = await featchData(text)

      //если выбираем единственное значение
   
        if (
          result.length != 0
          && text == result[0].value
          && result.length == 1
        ) {
          cleardaData()
        } else {
          showdaData(result)
        }
      
      
    }
  })
  .on('change')

/**
 * Добавляет в родительский блок новые элементы с полученными данными
 * @param {Array} result - Массив подсказок
 */
function showdaData(result) {
  result.forEach(item => {
    jQuery('<div/>', {
      class: 'daDataBlock__item',
      // data: 'daDataDiv',
      html: item.value
    }).attr('data-role','daData-item').appendTo(parentDiv)
  })
}

/**
 * Удаляет со страницы блоки с полученными данными
 */
function cleardaData() {
  $('[data-role=daData-item]').detach()
}

/**
 * По нажатию на всплывающие элементы вводить их в input
 */
$(document).on('click', '[data-role=daData-item]', function () {
  const text = $(this).html()
  $('#daDataService').val(text)
  $('#daDataService').trigger('keyup')
})


/**
 * Получение массива подсказок
 * @param {String} query - Текст запроса
 * @returns {Array} result.suggestions - Массив подсказок
 */
async function featchData(query){
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
    var token = "0477abaadddd74b2942118f92ea596bfbdde80ae"
    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
      body: JSON.stringify({
        query: query,
        count: maxCount,
        language: language
      })
    }
    
    //Отправка опций и получение результата (@result.suggestions)
    try {
      let response = await fetch(url, options)
      let result = await response.json()
      return result.suggestions
    } catch (error) {
      alert('Ошибка соединения ')
      console.log(error.response.status)
    }
}