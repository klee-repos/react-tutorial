var axios = require('axios');

var id = "id";
var sec = "secret";
var params = '?client_id=' + id + '&client_secret=' + sec;

function getProfile (username) {
	return axios.get('https://api.github.com/users/' + username)
		.then(function(profile) {
			return profile.data;
		})
}

function getRepos(username) {
	return axios.get('http://api.github.com/users/' + username + '/repos&per_page=100');
}

function getStarCount(repos) {
	return repos.data.reduce(function(count, repo) {
		return count+ repo.stargazers_count;
	}, 0)
}

function calculateScore(profile, repos) {
	var followers = profile.followers;
	var totalStars = getStarCount(repos);
	return (followers * 3) + totalStarts;
}

function handleError(error) {
	console.warn(error);
	return null;
}

function getUserData(player) {
	return axios.all([
		getProfile(player),
		getRepos(player)
	]).then(function(data) {
		var profile = data[0];
		var repos = data[1];

		return {
			profile: profile,
			score: calculateScore(profile, repos)
		}
	})
}

function sortPlayers(players) {
	return players.sort(function(a,b){
		return b.score - a.score;
	})
}


module.exports = {

	battle: function(players) {
		return axios.all(players.map(getUserData))
			.then(sortPlayers)
			.catch(handleError)
	},

	fetchPopularRepos: function(project) {
		var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=' + project + '&sort=stars&order=desc&type=Repositories');

		return axios.get(encodedURI)
			.then(function(response) {
				return response.data.items;
			}) 
	}
}