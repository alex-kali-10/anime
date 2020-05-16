function give_survey(obj,data){
    $.ajax({
        url: "/api/give_survey",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: data,
    }).done(function(response) {
        response = JSON.parse(response)
        obj.setState({data:response});
    }).fail(function (error) {
        console.log(error);
    });
}

function add_survey(obj,data){
    console.log(JSON.stringify(data));
    $.ajax({
        url: "/api/add_survey",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
        data: {data:JSON.stringify(data),id: obj.state.data.id},
    }).done(function(response) {
        obj.setState({data: '',page: 0});
    }).fail(function (error) {
        console.log(error);
    });
}




class React_survey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: '',page: 0,response_data:{},temporary_data:[]};
        window.react_survey = this;
    }

    changeResponse(event) {
        console.log(event.target.value);
        let t = Object.values(this.state.data.list_question)[this.state.page].type
        if(t === 'radio'){
            this.state.temporary_data = [event.target.value]
        }else{
            if(this.state.temporary_data.indexOf( event.target.value ) != -1){
                let index = this.state.temporary_data.indexOf( event.target.value );
                this.state.temporary_data.splice(index);
            }else{
                this.state.temporary_data.push(event.target.value)
            }
        }
    }

    nextPage(){
        if(this.state.temporary_data.length !== 0) {
            let id = Object.values(this.state.data.list_question)[this.state.page].id;
            this.state.response_data[id] = this.state.temporary_data;
            if (Object.values(this.state.data.list_question).length !== this.state.page + 1) {
                this.setState({page: this.state.page + 1,temporary_data:[]})

                $('.survey-block').addClass('active-animations');
                setTimeout(()=>  $('.survey-block').removeClass('active-animations'),420);
                $('.block-q>div').clone().appendTo('.block-q2');
                $('.block-q').addClass('to-right')
                $('.block-q2').addClass('to-center')
                setTimeout(()=>  $('.block-q').removeClass('to-right'),1);
                setTimeout(()=>  $('.block-q2').removeClass('to-center'),1);
                setTimeout(()=> $('.block-q2').empty(),400);
            }else{
                add_survey(this,this.state.response_data)
            }
        }
    }

    nextPageList(){
        if (Object.values(this.state.data.list_question).length !== this.state.page + 1) {
            this.setState({page: this.state.page + 1})
            $('.survey-block').addClass('active-animations');
            setTimeout(()=>  $('.survey-block').removeClass('active-animations'),420);
            $('.block-q>div').clone().appendTo('.block-q2');
            $('.block-q').addClass('to-right')
            $('.block-q2').addClass('to-center')
            setTimeout(()=>  $('.block-q').removeClass('to-right'),1);
            setTimeout(()=>  $('.block-q2').removeClass('to-center'),1);
            setTimeout(()=> $('.block-q2').empty(),400);
        }
    }

    prevPageList(){
        if (-1 !== this.state.page - 1) {
            this.setState({page: this.state.page - 1})
            $('.survey-block').addClass('active-animations');
            setTimeout(()=>  $('.survey-block').removeClass('active-animations'),420);
            $('.block-q2').addClass('right')
            $('.block-q>div').clone().appendTo('.block-q2');
            $('.block-q').addClass('to-left')
            $('.block-q2').addClass('to-center')
            setTimeout(()=>  $('.block-q').removeClass('to-left'),1);
            setTimeout(()=>  $('.block-q2').removeClass('to-center'),1);
            setTimeout(()=> $('.block-q2').empty(),400);
            setTimeout(()=> $('.block-q2').removeClass('right'),400);

        }
    }

    render() {
        console.log(this.state)
        let list_q;
        let q;
        if(this.state.data === ''){
            give_survey(this,{})
            return (
                <div className='survey-block'>

                </div>
            )


        }else if(this.state.data.check === 'false'){
            q =	Object.values(this.state.data.list_question);
            q = q[this.state.page]
            let list_r;
            let rs = Object.values(q.response);
            list_r = rs.map((item) =>
                <label className='r_of_q' key={item.id}>
                    <input type={q.type} value={item.id} name='q_form'/>
                    {item.text}
                </label>
            )
            return (
                <div className='survey-block box-shadow'>
                    <div className='name-block'>{this.state.data.name}</div>


                    <div className='block-q'>
                        <div className='q-name'>{q.text}</div>
                        <div onChange={this.changeResponse.bind(this)} id='resp'>
                            {list_r}
                        </div>

                    </div>
                    <div className='summit' onClick={()=>this.nextPage()}>Ответить</div>
                    <div className='block-q2'></div>
                </div>
            )
        }else{
            q =	Object.values(this.state.data.list_question);
            q = q[this.state.page]
            let list_r;
            let rs = Object.values(q.response);
            list_r = rs.map((item) =>
                <div className={'r_of_q q_'+item.my_response} key={item.id}>
                    <div className='count_resp'>{Math.round((item.count_response / this.state.data.all_response) * 100)}%</div>
                    {item.text}
                    <div className='progress' style={{width: Math.round((item.count_response / this.state.data.all_response) * 100) + '%'}}></div>
                </div>
            )
            return (
                <div className='survey-block box-shadow'>
                    <div className='name-block'>{this.state.data.name}</div>
                    <div className='block-q'>
                        <div className='q-name'>{q.text}</div>
                        {list_r}
                    </div>
                    <div className='prev_page' onClick={()=>this.prevPageList()}>Предыдущий</div>
                    <div className='next_page' onClick={()=>this.nextPageList()}>Следующий</div>
                    <div className='block-q2'></div>
                </div>
            )
        }
    }
}