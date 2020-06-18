import $ from 'jquery'

//Подписчик для View. Получает значение над руччкой ползунка и устанавливает его в панель управления
$(document).on("onclick", function(event, value, thumb, nameModel, parentElement) {
    const panel =  $(parentElement).siblings()[0];
    const parentId =  $(panel).attr('id');
    if (nameModel.oneThumb) {
        nameModel.value = value;
        $(panel).find(`#value-${parentId}`).val(value);
    }
    else {
        if (thumb === $(parentElement).find(".thumb:first-child")[0]){
            nameModel.values[0] = value;
            $(panel).find(`#values1-${parentId}`).val(value);
        }
        else {
            nameModel.values[1] = value;
            $(panel).find(`#values2-${parentId}`).val(value);
        } 
    }
});

//Подписчик для панели управления
$("input").on("change", function(event, nameModel, parentElement) {
    console.log(this.value, nameModel, parentElement)
});



 