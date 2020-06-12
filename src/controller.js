import $ from 'jquery'
import  {inputsValue, i} from './model.js'

//Подписчик для View
$(document).on("onclick", function(event, value, thumb, nameModel, parentElement){
    const panel =  $(parentElement).siblings()[0];
    const parentId =  $(panel).attr('id');
    if (nameModel.oneThumb) {
        
        // $(panel).find(`#value-${parentId}`).val(value);
    }
    else if (thumb === $(parentElement).find(".thumb:first-child")[0]){
        // $(panel).find(`#values1-${parentId}`).val(value);
    }
    else {
        // $(panel).find(`#values2-${parentId}`).val(value);
    }
});

//Подписчик для Model
$("input").on("change", function(event, nameModel, parentElement){
    console.log(event)
});

 