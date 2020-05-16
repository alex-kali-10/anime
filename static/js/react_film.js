class React_film extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: ''};
        this.state.pk = this.props.name;
        window.react_film = this;
    }



    render() {

        let item = this.state;
        console.log(item);
        if (item.data === ''){
            givePage(this, 'film/'+item.pk);
            return (
                <div className='content-block'>
                    гружусь
                </div>
            )
        }else{
            return (
                <div className='content-block'>
                    фильм
                </div>
            )
        }
    }
}