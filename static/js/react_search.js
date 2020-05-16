class React_search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
        window.react_search = this;
        this.changeText = this.changeText.bind(this);
        this.search = this.search.bind(this);
    }

    changeText(event) {
        this.setState({text: event.target.value});
    }

    search(event) {
        react_router.setState({page: 'search/'+this.state.text,data:''})
        this.setState({text:''})
        event.preventDefault();
    }

    render() {
        let item = this.state;
        return (
            <div className='block-search box-shadow'>
                <form id='search-form' onSubmit={this.search}>
                    <input type="text" value={this.state.text} onChange={this.changeText} />
                    <input type="submit" value=''/>
                </form>
            </div>
        )
    }
}


ReactDOM.render(
    <React_search />,
    document.getElementById('search')
);
