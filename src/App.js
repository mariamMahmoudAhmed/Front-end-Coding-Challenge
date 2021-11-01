import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import './App.css'

class FetchRepos extends React.Component {
  state = { 
  infos: [],
  noMore: true,
  page: 2,
  }

    async componentDidMount ()  {
    const url="https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc"
    const response = await fetch(url)
    const data = await response.json()
    //console.log(data)
    this.setState({infos: data.items})
   // console.log(this.state.infos)
 }
  render() {
  /* const timeInDaysFun =  () => {
    var createdData = this.state.infos.items.created_at.substring(0,10);
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const date1 = new Date(createdData);
    const date2 = new Date(date);
    const timeInMilliseconds = Math.abs(date2 - date1);
    const timeInDays = Math.ceil(timeInMilliseconds / (1000 * 60 * 60 * 24));
  } */
  const fetchRepos = async () => {
  const res = await fetch(`https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${this.state.page}`)
  const data = await res.json()
    return data
  }
  const fetchData = async () => {
  const reposFromTheServer = await fetchRepos()
  let uniqueChars = [...new Set(reposFromTheServer.items)];
  this.setState({
  infos: [...this.state.infos, ...uniqueChars],
  noMore: (reposFromTheServer.incomplete_results) ? true : false,
  page: (reposFromTheServer.incomplete_results === true) ? this.state.page+1 :0 ,
   })
       console.log(reposFromTheServer)
  }

    return (

 <InfiniteScroll
  dataLength={this.state.infos.length} //This is important field to render the next data
  next={fetchData}
  hasMore={this.state.noMore}
  loader={<h4>Loading...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>You have seen it all</b>
    </p>
  }
>
  {this.state.infos.map(info=>(

      <li key={info.id} className="card">
        <img src={info.owner.avatar_url} className="card img-size" alt="owner avatar"/>
        <div className="card">
        <div>
        <h4>{info.full_name}</h4>
        <h4>{info.id}</h4>
        <p>{info.description}</p>
        <p>Issues: {info.open_issues_count} </p>
        <p>Stars: {info.stargazers_count} </p>
         <p>Submitted {info.created_at.substring(0,10)} By {info.owner.login}</p>
        </div>
        </div>
      </li>
      ))
  
  }
</InfiniteScroll>
    )
  }
}

export default FetchRepos
