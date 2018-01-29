/* eslint-disable no-undef */
function search(query, cb) {
  return fetch(`api/?q=${query}`, {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .catch((error) => {
      console.log(error);
      cb(undefined, 'error!');
    });
}

// send the given jsonData to the server, and execute the cb with the response
function save(jsonData, cb) {
  fetch('/save', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(jsonData), 
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(checkStatus)
  .then(parseJSON)
  .then((res) => res.savedURL)
  .then(cb)
  .catch(error => console.error('Error:', error));
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { search, save };
export default Client;
