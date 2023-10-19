var last_form = null;
document.addEventListener('DOMContentLoaded', function () {

    //Add the likeDislike () function call to the heart's onclick method
    document.querySelectorAll('.fa-heart').forEach(div => {
        div.onclick = function () {
            likeDislike(this);
        };
    });
    //Intercepts the submit of the post change form and sends an asynchronous request via javascript.
    document.querySelectorAll("[id^='frm_edit_']").forEach(form => {
        form.onsubmit = function (e) {
            e.preventDefault();
            this.querySelector('#div_buttons').style.display = "none";
            if (this.querySelector('#alert_message') != null) {
                this.querySelector('#alert_message').remove();
            }
            let alert = this.querySelector('#post_text_alert_' + this.dataset.id);

            let input = this.querySelector('div>textarea');
            if (input.value.trim().length == 0) {
                alertMessage({
                    'error': 'This field is required.'
                }, alert, this.dataset.id);
                this.querySelector('#div_buttons').style.display = "";
                return 0;
            }
            var formData = $(this).serialize();
            let csrftoken = this.querySelector("input[name='csrfmiddlewaretoken']").value;
            fetch(`/editpost/${this.dataset.id}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "X-CSRFToken": csrftoken
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {

                    alertMessage(data, alert, this.dataset.id);
                    this.querySelector('#div_buttons').style.display = "";
                }).catch((error) => {
                    alertMessage({
                        'error': error.message
                    }, alert, this.dataset.id);
                    this.querySelector('#div_buttons').style.display = "";
                });
        }

    });
    //Displays the post editing form after clicking the edit link.
    document.querySelectorAll("[id^='edit_link_']").forEach(a => {
        a.onclick = function () {
            if (last_form != null) {
                hideForm(last_form);
            }
            last_form = this;
            let p = document.querySelector('#post_text_' + this.dataset.id);
            let form = document.querySelector('#frm_edit_' + this.dataset.id);
            p.style.display = 'none';
            form.querySelector('#id_post_edit_text').value = p.innerHTML;
            form.style.display = '';
        };

    });
    //Close the post editing form by clicking the close button.
    document.querySelectorAll("[id^='btn_close_']").forEach(a => {
        a.onclick = function () {
            hideForm(this);
        };

    });
    if (document.getElementById("btnfollow")) {
        document.querySelector('#btnfollow').addEventListener("click", function (event) {
            fetch(`/follow/${this.dataset.id}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('#sp_followers').innerHTML = data.total_followers;
                    if (data.result == "follow") {
                        this.innerHTML = "Following";
                        this.className = "btn btn-primary";
                    } else {
                        this.innerHTML = "Follow";
                        this.className = "btn btn-outline-primary";
                    }
                });

        })

        //Displays the Unfollow text on the Following button when passing the mouser.
        document.querySelector('#btnfollow').addEventListener("mouseover", function (event) {
            if (this.className == "btn btn-primary") {
                this.innerHTML = "Unfollow"
            }
        });

        //Displays the text "Following" on the Following button when removing the mouser.
        document.querySelector('#btnfollow').addEventListener("mouseleave", function (event) {
            if (this.className == "btn btn-primary") {
                this.innerHTML = "Following"
            }
        });

    }
    //It receives an element and makes the asynchronous call of the like method.
    async function likeDislike(element) {
        await fetch(`/like/${element.dataset.id}`)
            .then(response => response.json())
            .then(data => {
                element.className = data.css_class;
                element.querySelector('small').innerHTML = data.total_likes;
            });
    }
    //Receive an element and hide the post editing form.
    function hideForm(element) {
        let p = document.querySelector('#post_text_' + element.dataset.id);
        let form = document.querySelector('#frm_edit_' + element.dataset.id);
        p.style.display = '';
        form.querySelector('#id_post_edit_text').value = p.innerHTML;
        form.style.display = 'none';
    }
    //Displays the alert message according to the return (success or error).
    function alertMessage(data, alert, id) {
        let div = document.createElement('div');
        let sucess = false;
        div.setAttribute('role', 'alert');
        div.setAttribute('id', 'alert_message');
        if (document.getElementById('alert_message') == null) {
            if (data.error) {
                if (data.error.id_post_edit_text) {
                    div.innerHTML = data.error.id_post_edit_text.join();
                } else {
                    div.innerHTML = data.error;
                }
                div.className = 'alert alert-dismissible fade alert-danger in show';
            } else {
                sucess = true;
                document.querySelector('#post_text_' + id).innerHTML = data.text;
                div.innerHTML = "Post changed successfully!";
                div.className = 'alert alert-dismissible fade alert-success in show';
            }
        }
        alert.appendChild(div);
        var alert_message = document.getElementById('alert_message');
        setTimeout(function () {
            if (alert_message != null) {
                $(alert_message).fadeOut("fast");
                alert_message.remove();
                if (sucess) {
                    document.querySelector('#frm_edit_' + id).style.display = 'none';
                    document.querySelector('#post_text_' + id).style.display = '';
                }
            }
        }, 1000);
    }
});