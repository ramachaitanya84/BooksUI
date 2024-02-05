function makeAjaxRequest(url, method, data, successCallback, errorCallback) {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
  
    // Set up the request
    xhr.open(method, url, true);
  
    // Set the content type if sending data
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
  
    // Set up the event handlers
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Successful response
          if (successCallback) {
            successCallback(JSON.parse(xhr.responseText));
          }
        } else {
          // Error response
          if (errorCallback) {
            errorCallback(xhr.status, xhr.statusText);
          }
        }
      }
    };
  
    // Convert data to JSON if it is an object
    if (data && typeof data === "object") {
      data = JSON.stringify(data);
    }
  
    // Send the request with the data
    xhr.send(data);
  }; 
  