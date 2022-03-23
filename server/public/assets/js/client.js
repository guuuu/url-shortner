$(document).ready(() => {

})

$("#sub").click(() => {
    $.ajax({
        url: "/gen",
        type: "POST",
        dataType: "json",
        data:{
            "id": $("#id").val(),
            "url": $("#url").val()
        }
    })
    .done((response) => {
        $("body").append($.parseHTML(`<a target="_blank" href="${response.short_url}">${response.short_url}</a>`));
        navigator.clipboard.writeText(response.short_url);
        alert("New short URL copied to clipboard. 😃")
    })
    .catch((error) => {
        alert(error.responseJSON.message);
    })
})