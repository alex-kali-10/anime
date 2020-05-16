function login(obj,data){
    $.ajax({
        url: "/api/log",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        if(response['errors'] === 'false'){
            obj.setState({user_name: response['username'],avatar_url: response['avatar_url']})
            new_csrf();
        }else{
            $('#auth .login-error').empty();
            $('#auth .login-error').append('Пользователь не найден');
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function reg(obj,data){
    $.ajax({
        url: "/api/reg",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        if(response['errors'] === 'false'){
            obj.setState({user_name: response['username'],avatar_url: response['avatar_url']})
            new_csrf();
        }else{
            $('#auth .errors').empty();
            for(let i in response.errors){
                for(let error of response.errors[i]){
                    $('#auth .'+i).append(error.message);
                }
            }
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function new_csrf(){
    $.ajax({
        url: "/api/static_page/csrf",
        dataType: 'text',
    }).done(function(response) {
        eval(response);
        react_right_menu.setState({username: response['username']})
        if(typeof react_comments !== undefined){
            react_comments.setState({username: response['username'],list_comments:'false'})
        }
    }).fail(function (error) {
        console.log(error);
    });
}

//function change_avatar(obj,data){
//    console.log(data)
//    $.ajax({
//        url: "/api/change_avatar",
//        method: "POST",
//        headers: {'X-CSRFToken': csrf},
//        data: data,
//        dataType: "multipart/form-data",
//        processData: false,
//        contentType: false
//    }).done(function(response) {
//        response = JSON.parse(response)
//        console.log('ok');
//        console.log(response)
//    }).fail(function (error) {
//        console.log(error);
//    });
//}





class React_auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user_name:user,avatar_url: avatar_url, reg_name:'', reg_mail:'', reg_pass1:'', reg_pass2:'', log_name:'', log_pass1:''};
        window.react_auth = this;

        this.reg = this.reg.bind(this);
        this.changeRegName = this.changeRegName.bind(this);
        this.changeRegMail = this.changeRegMail.bind(this);
        this.changeRegPass1 = this.changeRegPass1.bind(this);
        this.changeRegPass2 = this.changeRegPass2.bind(this);

        this.log = this.log.bind(this);
        this.changeLogName = this.changeLogName.bind(this);
        this.changeLogPass1 = this.changeLogPass1.bind(this);

        this.avatar_form = this.avatar_form.bind(this);
    }

    reg(event) {
        console.log('регистрирую');
        reg(this,{username:this.state.reg_name,password1: this.state.reg_pass1,password2: this.state.reg_pass2,email: this.state.reg_mail})
        event.preventDefault();
    }

    avatar_form(event) {
        event.preventDefault();
        change_avatar(this,{avatar:this.state.file})
    }

    log(event) {
        login(this,{login:this.state.log_name,password: this.state.log_pass1})
        event.preventDefault();
    }

    changeRegName(event) {
        this.setState({reg_name: event.target.value});
    }

    changeRegMail(event) {
        this.setState({reg_mail: event.target.value});
    }

    changeRegPass1(event) {
        this.setState({reg_pass1: event.target.value});
    }

    changeRegPass2(event) {
        this.setState({reg_pass2: event.target.value});
    }

    changeLogName(event) {
        this.setState({log_name: event.target.value});
    }

    changeLogPass1(event) {
        this.setState({log_pass1: event.target.value});
    }

    changeHidden(event){
        if($('.top-menu2 .area-item').hasClass('area-item-hidden')){
            $('.top-menu2 .area-item').removeClass('area-item-hidden')
        }else{
            $('.top-menu2 .area-item').addClass('area-item-hidden')
        }
    }


    render() {
        let item = this.state;
        if(item.user_name === "AnonymousUser") {
            return (
                <div>
                   <div className='item' onClick={()=>this.changeHidden()}>
                        <div className="big-word">Войти!!!</div>
                    </div>
                    <div className='bottom-area-form login box-shadow'>
                        <div className='change-form'>
                            <div className='item-log' onClick={()=>$('.bottom-area-form').addClass('login')}>Авторизация</div>
                            <div className='item-reg' onClick={()=>$('.bottom-area-form').removeClass('login')}>Регистрация</div>
                            <div className='close-auth' onClick={()=>$('.area-item').addClass('area-item-hidden')}></div>
                        </div>

                        <div className='form-reg'>
                            <form id='reg_form' onSubmit={this.reg}>
                                <div className='item-form-name'>Логин</div>
                                <div className='errors username'></div>
                                <input type="text" value={this.state.reg_name} onChange={this.changeRegName} />

                                <div className='item-form-name'>Мейл</div>
                                <div className='errors email'></div>
                                <input type="text" value={this.state.reg_mail} onChange={this.changeRegMail} />

                                <div className='item-form-name'>Пароль</div>
                                <div className='errors password1'></div>
                                <input type="text" value={this.state.reg_pass1} onChange={this.changeRegPass1} />

                                <div className='item-form-name'>Повторный пароль</div>
                                <div className='errors password2'></div>
                                <input type="text" value={this.state.reg_pass2} onChange={this.changeRegPass2} />

                                <input type="submit" value="Зарегестрироваться" />
                            </form>
                        </div>



                        <div className='form-log'>
                            <form id='log_form' onSubmit={this.log}>
                                <div className='item-form-name'>Логин</div>
                                <div className='errors login-error'></div>
                                <input type="text" value={this.state.log_name} onChange={this.changeLogName} />

                                <div className='item-form-name'>Пароль</div>
                                <input type="text" value={this.state.log_pass} onChange={this.changeLogPass1} />

                                <input type="submit" value="Авторизироваться" />
                            </form>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className='item' onClick={()=>this.changeHidden()}>
                        <div className="big-word">Привет :)</div>
                    </div>
                    <div className='area-auth'>
                        <div className='block-avatar'>
                            <div className='avatar' style={{backgroundImage: 'url('+ this.state.avatar_url +')'}}></div>
                            <a href='/api/static_page/change_avatar' target="_blank" ><div className='change-avatar'>Изменить аву</div></a>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


//<table>
//    <div dangerouslySetInnerHTML= {{__html: form_avatar_html}} >
//    </div>
//</table>

ReactDOM.render(
    <React_auth />,
    document.getElementById('auth')
);