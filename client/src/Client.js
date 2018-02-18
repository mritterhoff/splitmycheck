/* eslint-disable no-undef */
function search(query, cb) {
  return fetch(`api/?q=${query}`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .catch((error) => {
      console.log(error);
      cb(undefined, 'error!');
    });
}

// send the given text to the server, and execute the cb with the response
function save(text, cb) {
  fetch('/save', {
    method: 'POST', // or 'PUT'
    body: text,
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  })
    .then(checkStatus)
    .then(res => res.text())
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
  console.log(error);
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { search: search, save: save };
export default Client;
