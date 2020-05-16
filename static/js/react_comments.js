function add_comment(obj,data){
    $.ajax({
        url: "/api/comment",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        let item = react_comments.state.list_comments
        item = Object.assign(item, response);
        obj.setState({comment:''})
        react_comments.setState({list_comments:item});
    }).fail(function (error) {
        console.log(error);
    });
}

function edit_comment(obj,data){
    $.ajax({
        url: "/api/comment",
        method: "PUT",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        console.log(response);
    }).fail(function (error) {
        console.log(error);
    });
}

function give_new_comments(obj,data){
    $.ajax({
        url: "/api/give_comments",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        console.log(response)
        if(response.last_comment_id === 'false'){
            obj.setState({list_comments:response.list});
        }else{
            let item = obj.state.list_comments;
            item = Object.assign(item, response.list)
            obj.setState({list_comments:item});
        }
    }).fail(function (error) {
        console.log(error);
    });
}






class React_comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list_comments: 'false',order_comment: 'new', username: react_auth.state.user_name};
        window.react_comments = this;
        this.state.id = props.id;
        this.old_comment = this.old_comment.bind(this);
    }

    old_comment(){
        if(Object.keys(this.state.list_comments).length !== 0){
            give_new_comments(this,{id: this.state.id,order: this.state.order_comment,last_comment_id: this.state.list_comments[Object.keys(this.state.list_comments)[0]].id})
        }
    }


    render() {
        let item = this.state;
        let commentsList;
        let comments;
        console.log(item);
        if(this.state.list_comments === 'false'){
            give_new_comments(this,{id: this.state.id,order: this.state.order_comment,last_comment_id: 'false'})
        }else{
            comments =	Object.values(this.state.list_comments);
            commentsList = comments.reverse().map((item) =>
                <React_comment key={item.id} type='views' my_name={this.state.username} username={item.username} user_id={item.user_id} id={item.id} text={item.text} carma={item.carma} count_like = {item.count_like} count_dislike = {item.count_dislike} avatar = {item.avatar}/>
            )
        }

        return (
            <div className='block-comments'>
                {(this.state.username !== "AnonymousUser")?(
                    <div>
                        <div className='name-block'>Оставить комментарий</div>
                        <Form_comment id={this.state.id} comment='' type='my_comment'/>
                    </div>
                ):(
                    <div className='not-auth'>Если бы вы зарегались то могли бы оставлять коментарии :)</div>
                )}
                <div className={'choise-comment-order '+this.state.order_comment}>
                    <div className='item-choise new-item' onClick={()=> this.setState({order_comment: 'new',list_comments: 'false'})}>Новые</div>
                    <div className='item-choise popular-item' onClick={()=> this.setState({order_comment: 'popular',list_comments: 'false'})}>Популярные</div>
                </div>


                {(this.state.list_comments !== "false")?(
                    <div className='area-comment-list'>
                        {commentsList}
                        <div className='button-old-comment' onClick={()=> this.old_comment()}>Загрузить комментарии</div>
                    </div>
                ):(
                    <div>гружусь</div>
                )}
            </div>
        )
    }
}



class Form_comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state= props;
        this.changeComment = this.changeComment.bind(this);
        this.add_comment = this.add_comment.bind(this);
    }

    changeComment(event) {
        this.setState({comment: event.target.value});
    }

    add_comment(event) {
        if(this.state.type === 'my_comment'){
            add_comment(this,this.state);
        }else{
            edit_comment(this,{id:this.state.id,comment:this.state.comment});
            this.state.obj.setState({text:this.state.comment,type:'views'})
        }
        event.preventDefault();
    }

    render() {
        let item = this.state;
        return(
            <form id='reg_form' onSubmit={this.add_comment}>
                <textarea value={this.state.comment} onChange={this.changeComment}/>
                <div className='comment-options'>
                    <input type="submit" value={(this.state.type === 'my_comment')?('Остваить коментарий'):('Редактировать коментарий')}/>
                </div>
            </form>
        )
    }


}



function change_carma(obj,data){
    $.ajax({
        url: "/api/change_carma",
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

function delete_comment(obj,data){
    $.ajax({
        url: "/api/comment",
        method: "DELETE",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(response.id);
        let item = react_comments.state.list_comments;
        delete item[response.id];
        react_comments.setState({list_comments:item})
    }).fail(function (error) {
        console.log(error);
    });
}



class React_comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state = props;
        this.like = this.like.bind(this);
        this.dislike = this.dislike.bind(this);
        this.edit = this.edit.bind(this);
        this.no_edit = this.no_edit.bind(this);
    }

    like(){
        if(react_auth.state.user_name !== "AnonymousUser"){
            let carma;
            if(this.state.carma === 'like'){
                carma = '';
            }else{
                carma = 'like';
            }
            change_carma(this,{id:this.state.id,carma: carma});
            this.setState({carma: carma});
        }
    }

    dislike(){
        let carma;
        if(react_auth.state.user_name !== "AnonymousUser") {
            if (this.state.carma === 'dislike') {
                carma = '';
            } else {
                carma = 'dislike';
            }
            change_carma(this,{id:this.state.id,carma: carma});
            this.setState({carma: carma});
        }
    }

    delete(){
        delete_comment(this,{id:this.state.id})
    }

    edit(){
        this.setState({type: 'edit'})
    }

    no_edit(){
        this.setState({type: 'views'})
    }
    render() {
        let item = this.state;

        return (
            <div className='comment'>
                <div className='username-block'>{item.username}</div>
                <div className='avatar' style={{backgroundImage: 'url(' + this.state.avatar + ')'}}></div>
                {(this.state.type === 'views')?(
                    <div>
                        {((this.state.username === this.props.my_name)?(
                            <div>
                                <div className='delete-block' onClick={()=>this.delete()}></div>
                                <div className='edit-block' onClick={()=>this.edit()}></div>
                            </div>
                            ):(
                                <div></div>
                            )
                        )}
                        {item.id}|||{item.text}
                    </div>
                    ):(
                        <div>
                            <div className='delete-block' onClick={()=>this.delete()}></div>
                            <div className='not-edit-block' onClick={()=>this.no_edit()}></div>
                            <Form_comment id={this.state.id} comment={item.text} type='edit' obj={this}/>
                        </div>
                    )}
                <div className={"karma-area karma_"+ this.state.carma}>
                    <div className='count'>{item.count_like}</div>
                    <div className='like' onClick={()=>this.like()}></div>
                    <div className='count'>{item.count_dislike}</div>
                    <div className='dislike'onClick={()=>this.dislike()}></div>
                </div>
            </div>
        )
    }

}