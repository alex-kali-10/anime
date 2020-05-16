class React_right_menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username:user,data: {
                1:{id:1,name:'vk',my_active: true,all_active: true,text: 'Лента Vk'},
                2:{id:2,name:'survey',my_active: true,all_active: true,text: 'Опросник'},
                3:{id:3,name:'catalog',my_active: true,all_active: true,text: 'Поиск'},
                4:{id:4,name:'chat',my_active: true,all_active: true,text: 'Чатик'},
        }};
        window.react_right_menu = this;
        this.setCheck = this.setCheck.bind(this);
        this.toTop = this.toTop.bind(this);
        this.toBot = this.toBot.bind(this);
    }

    block_item(name){
        if(name === 'vk'){
            return <div dangerouslySetInnerHTML= {{ __html : vk_frame }} />
        }
        if(name === 'survey'){
            return <React_survey />
        }
        if(name === 'catalog'){
            return <div className='catalog_react box-shadow'><React_catalog /> </div>
        }
        if(name === 'chat'){
            return <div className='chat box-shadow'>Сам чат реализовать не сложно, но развернуть его на сервере проблематично</div>
        }

    }

    setCheck(item){
        if(this.state.data[item].name === 'catalog' && react_router.state.page !== 'catalog'){
            catalog_state = false;
        }
        let state_data = this.state.data;
        state_data[item].my_active = !state_data[item].my_active
        this.setState({data:state_data})
    }

    toTop(item){
        let state_data = this.state.data;
        if(+item !== 1){
            let item1 = state_data[item];
            let item2 = state_data[item - 1];
            state_data[item] = item2;
            state_data[item - 1] = item1;
            this.setState({data: state_data});
        }
    }

    toBot(item){
        let state_data = this.state.data;
        let length = Object.keys(this.state.data).length;
        if(+item !== length){
            let item1 = state_data[+item];
            let item2 = state_data[+item + 1];
            state_data[+item] = item2;
            state_data[+item + 1] = item1;
            this.setState({data: state_data});
        }
    }

    active_options(){
        if($('.area-options').hasClass('options_active')){
            $('.area-options').removeClass('options_active');
        }else {
            $('.area-options').addClass('options_active');
        }
    }

    render() {
        let item = this.state;
        for(let i in item.data){
            if(item.data[i].name === 'survey' || item.data[i].name === 'chat'){
                if(this.state.username === "AnonymousUser"){
                    item.data[i].all_active = false;
                }else{
                    item.data[i].all_active = true;
                }
            }
            if(item.data[i].name === 'catalog' && react_router.state.page !== 'catalog'){
                item.data[i].all_active = true;
            }
        }
        let list_r = Object.values(item.data).map((item) =>
            (item.my_active === true && item.all_active === true)?(
                <div key={item.id}>
                    { this.block_item(item.name) }
                </div>
            ):(
                <div key={item.id}>
                </div>
            )

        )

        let list_input = Object.keys(item.data).map((item) =>
            <div className={'item_right_menu right_menu_'+this.state.data[item].all_active} key={item}>
                <label>
                    <input type='checkbox' checked={this.state.data[item].my_active} onChange={() => this.setCheck(item)}/>
                    {this.state.data[item].text}
                </label>
                <div className='to-top' onClick={()=> this.toTop(item)}></div>
                <div className='to-bot' onClick={()=> this.toBot(item)}></div>
            </div>
        )

        return (
            <div>
                <div className='area-options box-shadow'>
                    <div className='options'>
                        <div className='name-block'>Настройки</div>
                        <div className='icon-options' onClick={()=> this.active_options()}></div>
                        <div className='right-menu'>{list_input}</div>
                    </div>
                </div>
                {list_r}
            </div>
        )
    }
}

let vk_frame = `<iframe name="fXD232ea" frameBorder="0" class="box-shadow"
                   src="https://vk.com/widget_community.php?app=0&amp;width=297px&amp;_ver=1&amp;gid=42162102&amp;mode=2&amp;color1=&amp;color2=1B1616&amp;color3=333&amp;class_name=&amp;height=600&amp;url=https%3A%2F%2Fyummyanime.club%2Fcatalog%2Fitem%2Fgorod-v-kotorom-menya-net&amp;referrer=https%3A%2F%2Fyummyanime.club%2Ftop&amp;title=%D0%90%D0%BD%D0%B8%D0%BC%D0%B5%20%D0%93%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%B2%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%BE%D0%BC%20%D0%BC%D0%B5%D0%BD%D1%8F%20%D0%BD%D0%B5%D1%82%20%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD&amp;171c6986fce"
                   width="300" height="600" scrolling="no" id="vkwidget1"
                   style="overflow: hidden; height: 600px;margin-top: 10px"></iframe>`;


ReactDOM.render(
    <React_right_menu user={user} />,
    document.getElementById('right-menu')
);
