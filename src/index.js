import React from 'react';
import ReactDOM from 'react-dom';

class GitHubSearch extends React.Component {

 constructor(props) {
	super(props);
	this.onSearchBtnClick = this.onSearchBtnClick.bind(this);
	this.onSearchTxtChange = this.onSearchTxtChange.bind(this);
	this.onSort = this.onSort.bind(this);
	this.state = {repos: [], searchTxt: '', sortBy: 'score', sortOrder: 'desc', errorTxt: ''};
 }

 onSearchBtnClick(e) {
	e.preventDefault();
	if (sessionStorage.getItem(this.state.searchTxt)) {
	  const searchCached = JSON.parse(sessionStorage.getItem(this.state.searchTxt));
	  this.setState({repos: searchCached, sortBy: 'score', sortOrder: 'desc'});
	}
	else {
	  let url = 'https://api.github.com/search/repositories?q=' + this.state.searchTxt;
	  fetch(url)
	    .then(resp => resp.json())
	    .then(json => {
		  if (json.items !== undefined && json.items.length !== 0) {
		    this.setState({repos: json.items, errorTxt: ''});
		    sessionStorage.setItem(this.state.searchTxt, JSON.stringify(json.items));
		  }
		  else {
			  this.setState({errorTxt: 'Sorry, an error has occurred. Please try again later.'});
			  console.log('An error has occurred');
		  }
	    })
	    .catch(error => console.log('An error has occurred'));
	}
 }
 
 onSearchTxtChange(event) {
    this.setState({searchTxt: event.target.value});
 }
 
 onSort(event, key) {
    const repoState = this.state.repos;
	if (this.state.sortOrder === 'desc') {
		repoState.sort((a,b) => { 
			if (a[key] === null) return -1;
			if (b[key] === null) return 1;

			if (key === "score" || key === "stargazers_count")
				return a[key] - b[key];
			else 
				return a[key].localeCompare(b[key]);
		});
		this.setState({sortOrder: 'asc'});
	}
	else {
		repoState.sort((a,b) => {
			if (a[key] === null) return 1;
			if (b[key] === null) return -1;
			
			if (key === "score" || key === "stargazers_count")
				return b[key] - a[key];
			else 
				return b[key].localeCompare(a[key]);
		});
		this.setState({sortOrder: 'desc'});
	}
    this.setState({repos: repoState});
 }
  
 render() {
    const tblHdrStyle = {
	 cursor: 'pointer',
    };
	
	return(
	 <div>
		<h1>GitHub Repository Search</h1>
		<p>Use this tool to search GitHub by repository name</p>
		<h4><u>Instructions</u>:</h4>
		<ul>
			<li><b>Step 1:</b> Type a search term into the textbox</li>
			<li><b>Step 2:</b> Click the Search button or press Enter</li>
			<li><b>Step 3:</b> Sort results using the arrows below</li>
		</ul>
			
		<form>
			<input type="text" value={this.state.searchTxt} onChange={this.onSearchTxtChange} />
			&nbsp;
			<button disabled={!this.state.searchTxt} onClick={this.onSearchBtnClick}>Search</button>
		</form>
		<br/>
		
		<table border="1">
		    <thead>
			  <tr>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'name')}>Name &#9650;&#9660;</th>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'description')}>Description &#9650;&#9660;</th>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'stargazers_count')}>Stars &#9650;&#9660;</th>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'language')}>Language &#9650;&#9660;</th>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'full_name')}>Owner &#9650;&#9660;</th>
				<th style={tblHdrStyle} onClick={e => this.onSort(e, 'score')}>Score &#9650;&#9660;</th>
			  </tr>		  
			</thead>
			<tbody>
			 {this.state.repos.map((repo, index) => (
				<tr key={index}>
				 <td>{repo.name}</td>
				 <td>{repo.description}</td>
				 <td>{repo.stargazers_count}</td>
				 <td>{repo.language}</td>
				 <td>{repo.owner.login}</td>
				 <td>{repo.score}</td>
				</tr>		
			))}
		    </tbody>
        </table>
		<p style={{color: "red"}}>{this.state.errorTxt}</p>
		<footer>
			<p>Created by: Jason Jazzar<br/>Using React and Node.JS<br/></p>
		</footer>
	 </div>
	);
 }
}

ReactDOM.render(<GitHubSearch />, document.getElementById("root"));