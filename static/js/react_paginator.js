function search_lite(page,obj){
    console.log('page')
    let href = '/api/static_page/studio_pk/'+obj.props.name+'/'+obj.props.order+'/'+page;
    console.log(href);
    console.log(obj.props)
    $.ajax({
        url: href,
        method: "POST",
        headers: {'X-CSRFToken': csrf},
        dataType: 'text',
    }).done(function(response) {
        $('.list-film').html(response);
    }).fail(function (error) {
        console.log(error);
    });
}

class React_paginator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 1};
        this.state.lastPage = this.props.lastPage;
        this.state.type = this.props.type;

        if(this.props.type === 'catalog') {
            if(catalog_active === 'false') {
                this.state.data = {
                    genres: [],
                    minYear: '1900',
                    maxYear: '2030',
                    type: 'false',
                    state: 'false',
                    sezon: 'false',
                    rateYear: 'false',
                    order: 'false',
                    page: 1
                };
                search(this.state.data);
            }else{
                this.state.data = catalog_state;
                search(catalog_state);
                catalog_active = 'false';
            }
        }
        window.react_paginator = this;
    }

    toPage(page){
        this.setState({page: page});
        if(this.state.type === 'catalog'){
            let data = this.state.data;
            data.page = page;
            search(data);
        }else{
            search_lite(page,this)
        }
    }


    render() {
        let item = this.state;
        let list_page = [];
        if(item.lastPage < 12){
            let i = 1;
            while (i <= item.lastPage) {
                list_page.push(i);
                i++;
            }
        }else if(item.page <= 6){
            let i = 1;
            while (i <= 8) {
                list_page.push(i);
                i++;
            }
            list_page.push('...');
            list_page.push(item.lastPage - 1);
            list_page.push(item.lastPage );
        }else if(item.page > item.lastPage - 6){
            list_page.push(1)
            list_page.push(2)
            list_page.push('...');
            let i = 1;
            while (i <= 8) {
                list_page.push(item.lastPage - (8-i));
                i++;
            }
        }else{
            list_page.push(1)
            list_page.push(2)
            list_page.push('...');
            let i = item.page - 2;
            while (i <= item.page + 2) {
                list_page.push(i);
                i++;
            }
            list_page.push('...');
            list_page.push(item.lastPage - 1);
            list_page.push(item.lastPage );

        }
        let list = list_page.map((item) => {
            if(item !== this.state.page && item !== '...') {
                return <div className='page-href' onClick={()=>this.toPage(item)}>{item}</div>
            }
            return <div className='page-href not-active'>{item}</div>
        }
        );
        return (
            <div className='to-center'>
                {(this.state.page === 1)?(
                    <div className='page-href not-active'>&#x25c1;</div>
                ):(
                    <div className='page-href' onClick={()=>this.toPage(item.page - 1)}>&#x25c1;</div>
                )}

                {list}

                {(this.state.page === this.state.lastPage)?(
                    <div className='page-href not-active'>&#x25b7;</div>
                ):(
                    <div className='page-href' onClick={()=>this.toPage(item.page + 1)}>&#x25b7;</div>
                )}
            </div>
        )
    }
}