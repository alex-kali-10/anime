function change_carma_film(obj,data){
    console.log(data);
    $.ajax({
        url: "/api/change_carma_film",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        obj.setState({count_like: response.count_like,count_dislike: response.count_dislike})
    }).fail(function (error) {
        console.log(error);
    });
}

function change_list_film(obj,data){
    console.log(data);
    $.ajax({
        url: "/api/change_list_film",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        //obj.setState({count_like: response.count_like,count_dislike: response.count_dislike})
    }).fail(function (error) {
        console.log(error);
    });
}






class React_feedback_film extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state = props;
        this.like = this.like.bind(this);
        this.dislike = this.dislike.bind(this);
        this.best = this.best.bind(this);
        this.most_watch = this.most_watch.bind(this);
    }

    like(){
        if(react_auth.state.user_name !== "AnonymousUser"){
            let carma;
            if(this.state.my_carma === 'like'){
                carma = '';
            }else{
                carma = 'like';
            }
            change_carma_film(this,{id:this.state.id,carma: carma});
            this.setState({my_carma: carma});
        }
    }

    dislike(){
        let carma;
        if(react_auth.state.user_name !== "AnonymousUser") {
            if (this.state.my_carma === 'dislike') {
                carma = '';
            } else {
                carma = 'dislike';
            }
            change_carma_film(this,{id:this.state.id,carma: carma});
            this.setState({my_carma: carma});
        }
    }


    best(){
        let carma;
        console.log(this.state.my_carma)
        if(react_auth.state.user_name !== "AnonymousUser") {
            if (this.state.my_list === 'best') {
                carma = '';
            } else {
                carma = 'best';
            }
            change_list_film(this,{id:this.state.id,carma: carma});
            this.setState({my_list: carma});
        }
    }


    most_watch(){
        let carma;
        if(react_auth.state.user_name !== "AnonymousUser") {
            if (this.state.my_list === 'most_watch') {
                carma = '';
            } else {
                carma = 'most_watch';
            }
            change_list_film(this,{id:this.state.id,carma: carma});
            this.setState({my_list: carma});
        }
    }




    render() {
        let item = this.state;
        console.log(item)
        return (
            <div className={"block-feedback karma_"+ this.state.my_carma + ' my_list_' + this.state.my_list}>
                <div className="reiting-line-area">
                    <div className='area-click-left' onClick={()=>this.like()}></div>
                    <div className="count-likes">{item.count_like}</div>
                    <div className="line"><div className="dislike-line" style={{width: Math.round((item.count_dislike / (item.count_dislike+item.count_like)) * 100) + '%'}}></div></div>
                    <div className="count-dislikes">{item.count_dislike}</div>
                    <div className='area-click-right' onClick={()=>this.dislike()}></div>
                </div>
                <div className='my-list-area'>
                    <div className='my-list'  onClick={()=>this.best()}>В избранное</div>
                    <div className='most-watch' onClick={()=>this.most_watch()}>Буду смотреть</div>
                </div>
            </div>
        )
    }
}

