
let list_genre = [
    'Альтернативная история',
    'Альтернативная реальность',
    'Андроиды',
    'Антивойна',
    'Антиутопия',
    'Баскетбол',
    'Безумие',
    'Бисёнэн',
    'Боевые искусства',
    'Божества',
    'Вампиры',
    'Ведьмы',
    'Вестерн',
    'Виртуальная реальность',
    'Военная тематика',
    'Война',
    'Воры',
    'Гарем (для девочек)',
    'Гендерная интрига',
    'Детектив',
    'Драконы',
    'Драма',
    'Зомби',
    'Игры',
    'Инопланетные расы',
    'Искусственный интеллект',
    'Искусство',
    'Исторический',
    'Исэкай',
    'Киберпанк',
    'Киборги',
    'Комедия',
    'Космос',
    'Кулинария',
    'Лоликон',
    'Любовный треугольник',
    'Магия',
    'Манга',
    'Махо-сёдзё',
    'Машины',
    'Меха',
    'Мистика',
    'Музыка',
    'Не японское',
    'Нелинейный сюжет',
    'Ниндзя',
    'Охотники за головами',
    'Параллельные миры',
    'Пародия',
    'Перестрелки',
    'Пилотируемые роботы',
    'Пираты',
    'Повседневность',
    'Политика',
    'Полицейские',
    'Полулюди',
    'Постапокалиптика',
    'Преступность',
    'Призраки',
    'Приключения',
    'Прокси бои',
    'Психология',
    'Путешествия во времени',
    'Романтика',
    'Русалки',
    'Русские в аниме',
    'Самураи',
    'Сверхъестественное',
    'Сёдзё',
    'Сёдзё-ай',
    'Сёнэн',
    'Сёнэн-ай',
    'Силовые костюмы',
    'Современное фэнтези',
    'Спорт',
    'Сражения на мечах',
    'Стимпанк',
    'Суккубы',
    'Суперспособности',
    'Сэйнэн',
    'Тайный заговор',
    'Темное фэнтези',
    'Темные эльфы',
    'Террористы',
    'Трансформеры',
    'Триллер',
    'Убийцы',
    'Ужасы',
    'Фантастика',
    'Феи',
    'Фэнтези',
    'Школьная жизнь',
    'Экшен',
    'Эльфы',
    'Эротика',
    'Этти',
];

function search(data){
    data = Object.assign({},data);
    let mass = data['genres'];
    mass = mass.filter(function(x) {
        return x !== undefined && x !== null;
    });
    delete data.genres;
    data['genres'] = JSON.stringify(mass)

    if(data['type'] === 'film'){
        data['type'] = 'Полнометражный фильм'
    }else if(data['type'] === 'serial'){
        data['type'] = 'Сериал'
    }

    if(data['rateYear'] === 'G'){
        data['rateYear'] = 'G (для всех возрастов)'
    }else if(data['rateYear'] === 'PG'){
        data['rateYear'] = 'PG (для детей)'
    }else if(data['rateYear'] === 'PG-13'){
        data['rateYear'] = 'PG-13 (от 13 лет)'
    }else if(data['rateYear'] === 'R-17'){
        data['rateYear'] = 'R-17+ (насилие и/или нецензурная лексика)'
    }else if(data['rateYear'] === 'RR'){
        data['rateYear'] = 'R+ (частичная нагота)'
    }

    if(data['state'] === 'vishel'){
        data['state'] = 'вышел'
    }else if(data['state'] === 'ongoing'){
        data['state'] = 'выходит'
    }else if(data['state'] === 'anons'){
        data['state'] = 'анонс'
    }

    if(data['sezon'] === 'zima'){
        data['sezon'] = 'Зима'
    }else if(data['sezon'] === 'vesna'){
        data['sezon'] = 'Весна'
    }else if(data['sezon'] === 'osen'){
        data['sezon'] = 'Осень'
    }else if(data['sezon'] === 'leto'){
        data['sezon'] = 'Лето'
    }



    $.ajax({
        url: "/api/catalog/",
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        data: JSON.stringify(data),
        dataType: 'text',
    }).done(function(response) {
        $('.list-film').html(response);

        if(data.page === 1){
            const script = document.getElementById('change_max_page').innerHTML;
            window.eval(script);
        }
    }).fail(function (error) {
        console.log(error);
    });
}


class React_catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {genres:[],minYear:'1980',maxYear:'2020',type:'false',state:'false',sezon:'false',rateYear:'false',order:'false',page: 1};
        window.react_catalog = this;
        if(catalog_state !== false){
            this.state = catalog_state;
        }

        this.changeMaxYear = this.changeMaxYear.bind(this);
        this.changeMinYear = this.changeMinYear.bind(this);
    }


    componentWillUnmount(){
        if(react_router.state.page !== 'catalog') {
            let right_menu_state = react_right_menu.state.data;
            for (let i in right_menu_state) {
                if (right_menu_state[i].name === 'catalog') {
                    right_menu_state[i].all_active = true;
                    break;
                }
            }
            react_right_menu.setState({data: right_menu_state})
        }else{

        }
    }

    changetype(type){
        this.setState({type:type})
        setTimeout(() => $('.change-state').addClass('o-hidden'));
    }

    changestate(state){
        this.setState({state:state})
        setTimeout(() => $('.change-state').addClass('o-hidden'));
    }

    changesezon(sezon){
        this.setState({sezon:sezon})
        setTimeout(() => $('.change-sezon').addClass('o-hidden'));
    }

    changerateYear(rateYear){
        this.setState({rateYear:rateYear})
        setTimeout(() => $('.change-rateYear').addClass('o-hidden'));
    }

    changeorder(order){
        this.setState({order:order})
        setTimeout(() => $('.change-order').addClass('o-hidden'));
    }

    add_genres(genres){
        if(this.state.genres.indexOf( genres ) === -1) {
            let item = this.state.genres;
            item.push(genres)
            this.setState({genres: item})

            setTimeout(() => $('.list-genre').addClass('hidden'), 0);
        }
    }

    delete_genres(genres){
        let item = this.state.genres;
        delete item[item.indexOf( genres )];
        this.setState({genres: item})
    }

    changeMaxYear(event) {
        if(+event.target.value > +this.state.minYear){
            this.setState({maxYear: event.target.value});
        }
    }
    changeMinYear(event) {
        if(+event.target.value < +this.state.maxYear){
            this.setState({minYear: event.target.value});
        }
    }

    poisk(){
        if(react_router.state.page === 'catalog') {
            search(this.state);
            react_paginator.state.data = Object.assign({}, this.state);
            react_paginator.setState({page: 1});
        }else{
            react_router.setState({page:'catalog',data:''});
            catalog_active = 'true';
        }
    }

    render() {
        catalog_state = this.state;
        let genresList = list_genre.map((item) =>
            <div key={item}>
                {(this.state.genres.indexOf( item ) !== -1)?(
                    <div key={item} className="genre active" onClick={() => this.add_genres(item)}>
                        {item}
                    </div>
                ):(
                    <div className="genre" onClick={() => this.add_genres(item)}>
                        {item}
                    </div>
                )}
            </div>
        );


        let genresActiveList = this.state.genres.map((item) =>
            <div key={item} className="active_genre">
                {item}<div className='close-area' onClick={() => this.delete_genres(item)}></div>
            </div>
        );



        let item = this.state;

        return (
            <div className='react_conteiner'>
                <div className='left-block'>

                    {genresActiveList}
                    <div className='add-genre' onClick={() => $('.list-genre').removeClass('hidden')} onMouseLeave={() => $('.list-genre').addClass('hidden')}>Добавить жанр
                        <div className='list-genre hidden'>
                            {genresList}
                        </div>
                    </div>


                </div>
                <div className='right-block'>

                    <div className='name-poisk'><div className='border-bottom'>Год выпуска</div> </div>
                    <div className="range">
                        <input className="min" type="number" value={this.state.minYear} onChange={this.changeMinYear}/>
                        <div className="rangeslider">
                            <input className="min" type="range" step='1' value={this.state.minYear}  name="volume" min='1980' max='2020' onChange={this.changeMinYear}/>
                            <input className="max" type="range" step='1' value={this.state.maxYear}  name="volume" min='1980' max="2020" onChange={this.changeMaxYear}/>
                        </div>
                        <input className="max" type="number" value={this.state.maxYear} onChange={this.changeMaxYear}/>
                    </div>

                    <div className='left-poisk'>
                        <div className='name-poisk'><div className='border-bottom'>Тип</div></div>


                        <div className={item.type+' change-list o-hidden change-type'} onClick={() => $('.change-type').removeClass('o-hidden')} onMouseLeave={() => $('.change-type').addClass('o-hidden')}>
                            <div className='item' onClick={() => this.changetype('false')}>Неважно</div>
                            <div className='item' onClick={() => this.changetype('film')}>Полнометражный фильм</div>
                            <div className='item' onClick={() => this.changetype('serial')}>Сериал</div>
                        </div>



                        <div className='name-poisk'><div className='border-bottom'>Статус</div></div>
                        <div className={item.state+' change-list o-hidden change-state'} onClick={() => $('.change-state').removeClass('o-hidden')} onMouseLeave={() => $('.change-state').addClass('o-hidden')}>
                            <div className='item' onClick={() => this.changestate('false')}>Неважно</div>
                            <div className='item' onClick={() => this.changestate('vishel')}>Вышел</div>
                            <div className='item' onClick={() => this.changestate('ongoing')}>Онгоинг</div>
                            <div className='item' onClick={() => this.changestate('anons')}>Анонс</div>
                        </div>

                        <div className='name-poisk'><div className='border-bottom'>Сезон</div></div>
                        <div className={item.sezon+' change-list o-hidden change-sezon'} onClick={() => $('.change-sezon').removeClass('o-hidden')} onMouseLeave={() => $('.change-sezon').addClass('o-hidden')}>
                            <div className='item' onClick={() => this.changesezon('false')}>Неважно</div>
                            <div className='item' onClick={() => this.changesezon('zima')}>Зима</div>
                            <div className='item' onClick={() => this.changesezon('vesna')}>Весна</div>
                            <div className='item' onClick={() => this.changesezon('leto')}>Лето</div>
                            <div className='item' onClick={() => this.changesezon('osen')}>Осень</div>
                        </div>
                    </div>

                    <div className='right-poisk'>
                        <div className='name-poisk'><div className='border-bottom'>Возрастной рейтинг</div></div>
                        <div className={item.rateYear+' change-list o-hidden change-rateYear'} onClick={() => $('.change-rateYear').removeClass('o-hidden')} onMouseLeave={() => $('.change-rateYear').addClass('o-hidden')}>
                            <div className='item' onClick={() => this.changerateYear('false')}>Неважно</div>
                            <div className='item' onClick={() => this.changerateYear('G')}>G (для всех возрастов)</div>
                            <div className='item' onClick={() => this.changerateYear('PG')}>PG (для детей)</div>
                            <div className='item' onClick={() => this.changerateYear('PG-13')}>PG-13 (от 13 лет)</div>
                            <div className='item' onClick={() => this.changerateYear('R-17')}>R-17+ (насилие и/или нецензурная лексика)</div>
                            <div className='item' onClick={() => this.changerateYear('RR')}>R+ (частичная нагота)</div>
                        </div>

                        <div className='name-poisk'><div className='border-bottom'>Сортировка по:</div></div>
                        <div className={item.order+' change-list o-hidden change-order'} onClick={() => $('.change-order').removeClass('o-hidden')} onMouseLeave={() => $('.change-order').addClass('o-hidden')}>
                            <div className='item' onClick={() => this.changeorder('false')}>Неважно</div>
                            <div className='item' onClick={() => this.changeorder('rate')}>Рейтингу</div>
                            <div className='item' onClick={() => this.changeorder('views')}>Просмотрам</div>
                            <div className='item' onClick={() => this.changeorder('alf')}>По алфавиту</div>
                            <div className='item' onClick={() => this.changeorder('new-old')}>По дате(сначала новые)</div>
                            <div className='item' onClick={() => this.changeorder('old-new')}>По дате(сначала старые)</div>
                        </div>
                        
                        <div className='name-poisk per-hidden'></div>
                        <div className='poisk-button' onClick={() => this.poisk()}>Искать</div>
                    </div>

                </div>
            </div>
        )
    }
}