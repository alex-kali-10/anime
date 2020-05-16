function givePage(obj,name_page){
    $.ajax({
        url: "/api/"+name_page,
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
    }).done(function(response) {
  //      console.log(response);
        obj.setState({data:response});
    }).fail(function (error) {
        console.log(error);
    });
}




class React_router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: page_router,type_page: 'static',data: ''};
        window.react_router = this;
    }

    toPage(page){
        let type_page = 'static';
        this.setState({page: page,type_page: type_page,data: ''});
    }

    componentDidUpdate() {
        react_right_menu.setState({});
        if(document.getElementById('myScript') !== null) {
            const script = document.getElementById('myScript').innerHTML;
            window.eval(script);
        }
    }


    render() {
        let item = this.state;
        //console.log(item);


        if('/static_page/'+item.page !== document.location.pathname) {
            setLocation(this.state, '/static_page/'+item.page);
        }


        if (item.data === ''){
            givePage(this, 'static_page/'+item.page);
            return (
                <div className='content-block'>
                    гружусь
                </div>
            )
        }else{
            return (
                <div className='content-block'>
                    <div dangerouslySetInnerHTML= {{__html: item.data}} >

                    </div>
                </div>
            )
        }
    }
}


ReactDOM.render(
<React_router />,
    document.getElementById('content')
);



function setLocation(state,curLoc){
    window.history.pushState(state, "Title", curLoc);
}

window.onpopstate = function(event) {
    react_router.setState(event.state);
};



function ChangeVideo(id_video_block,href){
    $('#'+id_video_block+" .area-for-player").html('<iframe className="main-player" width="100%" height="360" frameBorder="0" scrolling="no" allowFullScreen="" src="'+href+'"></iframe>');
}



function change_active(item){
    if($(item).hasClass('not-active')){
        $(item).removeClass('not-active')
    }else{
        $(item).addClass('not-active')
    }
}




function menu_active(item){
    if($('.top-menu').hasClass('active-mobile-menu')){
        $('.top-menu').removeClass('active-mobile-menu')
    }else{
        $('.top-menu').addClass('active-mobile-menu')
    }
}



$('.menu-button').click(function() {
    if($(this).is('.active:not(.back)')) {
        $(this).addClass('back');
        $('body').removeClass('view-left-block');
    } else if ($(this).is('.back')) {
        $(this).removeClass('back');
        $('body').addClass('view-left-block');
    } else {
        $(this).addClass('active');
        $('body').addClass('view-left-block');
    }
});


$('.menu-icon').click(function(){
    if ($(this).is('.clicked')) {
        console.log('закрываю');
        $('body').removeClass('view-top-block');
    }else{
        console.log('лткрываю');
        $('body').addClass('view-top-block');
    }

    $(this).toggleClass('clicked');
});

