$(document).ready(() => {
    let arr = JSON.parse(localStorage.getItem("urls")) || [];

    $.each(arr, (i, el) => {
        $("#old_urls").append($.parseHTML(`<p>${el.date} - <a target="_blank" href="${el.short_url}">${el.short_url}</a>`))
    });

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

            const date = new Date();
            arr.unshift({ "short_url": response.short_url, "date": `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` });
            localStorage.setItem("urls", JSON.stringify(arr));

            $("body").prepend($.parseHTML("<div class='alert alert-success show fade' id='alert'>New short URL copied to clipboard. 😃</div>"));
            $("#id, #url").val("");
            $("#old_urls").append($.parseHTML(`<p>${arr[0].date} - <a target="_blank" href="${arr[0].short_url}">${arr[0].short_url}</a>`))
            const alert = new bootstrap.Alert($("#alert")[0]);
            setTimeout(() => { alert.close(); }, 3000);
        })
        .catch((error) => {
            $("body").prepend($.parseHTML(`<div class='alert alert-warning show fade' id='alert'>${error.responseJSON.message}</div>`)); 
            const alert = new bootstrap.Alert($("#alert")[0]);
            setTimeout(() => { alert.close(); }, 3000);
        });
    });
});
