
var React = require('react');
var PropType = require('prop-types');
var api = require('../utils/api');

function SelectProject(props) {
	var projects = ['Alexa','Ethereum','Bitcoin','React'];
	return (
		<ul className='projects'>
			{projects.map(function(project) {
				return (
					<li 
						style={project === props.selectedProject ? {color: '#d0021b'} :null}
						onClick={props.onSelect.bind(null, project)} 
						key={project}> 
							{project}
					</li>
				)
			})}
		</ul> 
	)
}

function RepoGrid (props) {
	return (
		<ul className='popular-list'>
			{props.repos.map(function(repo,index) {
				return (
					<li key={repo.name} className='popular-item'>
						<div className='popular-rank'>#{index+1}</div>
						<ul className='space-list-items'>
							<li>
								<img
									className='avatar'
									src={repo.owner.avatar_url}
									alt={'Avatar for ' + repo.owner.login}
								/>
							</li>
							<li><a href={repo.html_url}>{repo.name}</a></li>
							<li>@{repo.owner.login}</li>
							<li>{repo.stargazers_count} stars</li>
						</ul>
					</li>
				)		
			})}
		</ul>

	)
}

class Popular extends React.Component {

	constructor (props) {
		super();
		this.state = {
			selectedProject: 'Alexa',
			repos: null
		};
		this.updateProject = this.updateProject.bind(this);
	}

	componentDidMount() {
		this.updateProject(this.state.selectedProject);
	}

	updateProject(project) {
		this.setState(function() {
			return {
				selectedProject: project,
				repos: null
			}
		})

		api.fetchPopularRepos(project)
			.then(function(repos) {
				this.setState(function() {
					return {
						repos:repos
					}
				})
			}.bind(this))
	}

	render() {
		return (
			<div>
				<SelectProject
					selectedProject={this.state.selectedProject}
					onSelect={this.updateProject}
				/>
				{!this.state.repos
					? <p>Loading</p>
					: <RepoGrid repos={this.state.repos}/>
				}
			</div>
		)
	}

}

SelectProject.propTypes = {
	selectedProject: PropType.string.isRequired,
	onSelect: PropType.func.isRequired,
}

RepoGrid.propTypes = {
	repos: PropType.array.isRequired,
}

module.exports = Popular;