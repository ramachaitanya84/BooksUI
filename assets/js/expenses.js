 /**
   * Easy GetElement By ID fuction
   */
 const element = (id) => {
  return document.getElementById(id);
}

var selectedRow = null;

var expenseData = "";
var pageCount = 1;
var pageRowCount = 25;
var selectedYear = new Date().getFullYear();
var filteredData = {data:[]};
var isDescValid = false;
var isNotesValid = true;
var isCostValid = false;
var areThereChanges = false;

/**
 * AJAX call
 */

var errorCallback = function (status, statusText) {
  console.error("Error:", status, statusText);
  alert("API returned error: " + status + statusText);
};

function dataTableLoad() {

  var url = "http://18.232.160.77:5000/api/";
  var method = "GET";
  var data = null; // Data to send, if any

  var successCallback = function (response) {
    console.log("Success:", response);
    expenseData = response.data;
    getDataByYear(selectedYear);
    loadData(1, filteredData.data, "expenseTable");

  };

  makeAjaxRequest(url, method, data, successCallback, errorCallback);
}

window.onload = ()=>{dataTableLoad()};

function getDataByYear (selYear) {

  filteredData = {data:[]};

  for (var i = 0; i < expenseData.length; i++) {
    if( selYear == 0 || selYear == parseInt(expenseData[i]['Date'].substring(0,4))) {
      filteredData.data.push(expenseData[i]);
    }
  }
  
};

function loadData (pgCount, responseJSON, tableElementId){

  var table = document.getElementById(tableElementId);
  pageCount = pgCount;

  // Clear existing content from the table
  table.innerHTML = '';

  //Create the table header row
  var headerRow = table.insertRow(0);
  for (var key in responseJSON[0]) {
    if (responseJSON[0].hasOwnProperty(key)) {
      var headerCell = headerRow.insertCell(-1);
      headerCell.textContent = key;
      headerCell.className = "headerRow";
    }
  }

  var startrow = pageRowCount * (pageCount-1);
  var endRow = pageRowCount * (pageCount)-1;

  // Create the table rows and cells for each JSON object
  for (var i = startrow; i <= endRow; i++) {

    var row = table.insertRow(-1);

    row.onclick = (el) => {loadSingleItem(el);};

    for (var key in responseJSON[i]) {
      if (responseJSON[i].hasOwnProperty(key)) {
        var cell = row.insertCell(-1);
        if (key == 'Date'){
          cell.textContent = responseJSON[i][key].substring(0,10);
        }
        else if (key == 'Details' || key == 'Notes') {
          cell.className = "tdDescWidth";
          cell.textContent = responseJSON[i][key];
        }
        else if (key == 'Cost' || key == 'Total Cost'){
          cell.textContent = "$" + responseJSON[i][key];
        }
        else if (key == 'HST'){
          if(responseJSON[i][key] == 1){
            cell.innerHTML = '<i class="bi bi-check2-square"></i>';
            cell.className = "tdCenter";
          }
          else{
            cell.innerHTML = '<i class="bi bi-square"></i>';
            cell.className = "tdCenter";
          }
        }
        else{
          cell.textContent = responseJSON[i][key];
        }
      }
    }
  }

  paginationControl();
};

function loadSingleItem (el) {

  if(el == null) {
    selectedRow = null;
    element('expenseId').innerHTML = "Expense No.";
    element('expenseDescription').value = "";
    element('expenseDate').value = new Date().getFullYear() + "-"+ 
    (new Date().getMonth() < 10 ? "0": "") + (new Date().getMonth() + 1) + "-" + 
    (new Date().getDate() < 10? "0" : "") + new Date().getDate();
    element('expenseCost').value = "";
    element('expenseIncludesHST').checked = false ;
    element('expenseTotalCost').value = "";
    element('expenseNotes').value = "";

    editSingleItem();
  } 
  else {
    selectedRow = el.srcElement.parentElement;
    element('expenseId').innerHTML = "Expense No. " + selectedRow.cells[0].textContent;
    element('expenseCategory').value = selectedRow.cells[1].textContent;
    element('expenseDescription').value = selectedRow.cells[2].textContent;
    element('expenseDate').value = selectedRow.cells[3].textContent;
    element('expenseCost').value = selectedRow.cells[4].textContent.substring(1);
    element('expenseIncludesHST').checked = selectedRow.cells[5].children[0].className == "bi bi-check2-square" ? true : false ;
    element('expenseTotalCost').value = selectedRow.cells[6].textContent.substring(1);
    element('expenseNotes').value = selectedRow.cells[7].textContent;

    readOnlySingleItem();
    ResetTableRows();
    selectedRow.className = 'rowSelected';
    for(var cnt = 0; cnt < selectedRow.cells.length; cnt++) {
      selectedRow.cells[cnt].style.backgroundColor = '#C7E4FC';
    }
  }

  document.getElementById('detailCard').className = "detailcard";
  document.getElementById('main').style.marginRight = "250px";
};

function editSingleItem () {
  element('expenseCategory').disabled = false;
  element('expenseDescription').disabled = false;
  element('expenseDate').disabled = false;
  element('expenseCost').disabled = false;
  element('expenseIncludesHST').disabled = false;
  element('expenseNotes').disabled = false;
  element('saveChanges').disabled = false;
  element('cancelChanges').disabled = false;
};

function readOnlySingleItem () {
  element('expenseCategory').disabled = true;
  element('expenseDescription').disabled = true;
  element('expenseDate').disabled = true;
  element('expenseCost').disabled = true;
  element('expenseIncludesHST').disabled = true;
  element('expenseNotes').disabled = true;
  element('saveChanges').disabled = true;
  element('cancelChanges').disabled = true;

  isCostValid = true;
  isDescValid = true;
  isNotesValid = true;
}

function paginationControl () {
  var totalPages = Math.ceil((filteredData.data.length)/pageRowCount);

  element('lblCurrentPage').innerHTML = "Showing page " + pageCount + " of " + totalPages;

  var pageControlGen = "";

  for (var i = 1; i <= totalPages; i++) {
    
    if (i == pageCount) {
      pageControlGen += i;
    }
    else {
      pageControlGen += "<span class=\"link-primary\" onClick=\"loadData(" + i + ", filteredData.data, 'expenseTable', selectedYear)\">" + i + "</span>";
    }
    

    if (i < totalPages) {
      pageControlGen += " | ";
    }

  }

  element('paginationCtrl').innerHTML = pageControlGen;
};

function changePageSize () {
  pageRowCount = parseInt(element('pageSortOption').value);
  loadData (1, filteredData.data, "expenseTable");

}

function changeYear () {
  selectedYear = parseInt(element('yearSelection').value);
  getDataByYear(selectedYear);
  loadData (1, filteredData.data, "expenseTable");
};

function calculateTotalCost() {

  if (element('expenseCost').value == "") {
    isCostValid = false;
  }
  else {
    var expenseCost = parseFloat(element('expenseCost').value);

    if(CheckCurrency(expenseCost, 'expenseCost')) {
      if (element('expenseIncludesHST').checked) {
        element('expenseTotalCost').value = expenseCost.toFixed(2);
      }
      else{
        var totalCost =  expenseCost * 1.13
        element('expenseTotalCost').value = totalCost.toFixed(2);
      }
      isCostValid = true;
    }
    else {
      element('expenseTotalCost').value = "";
      isCostValid = false;
    }
    
    element('expenseCost').value = expenseCost.toFixed(2);
    areThereChanges = true;
  }
}

function saveChanges() {
  if (areThereChanges) {
    if (isCostValid && isDescValid && isNotesValid) {
      var url = "http://18.232.160.77:5000/api/";

      var expId = element('expenseId').innerHTML.split(".").pop().trimStart();
      var expCategory = element('expenseCategory').value;
      var expDescription = element('expenseDescription').value;
      var expDate = element('expenseDate').value;
      var expCost = element('expenseCost').value;
      var expElement = element('expenseIncludesHST').checked;
      var expTotalCost = element('expenseTotalCost').value;
      var expNotes = element('expenseNotes').value;

      var method = "";

      if(selectedRow == null) {
        //Insert Row
        method = "POST";
      }
      else {
        method = "PUT";
        url = url + expId;
      }

      var data = {
        "Category": expCategory,
        "Description": expDescription,
        "ExpenseDate": expDate,
        "Cost": expCost,
        "IncludesHST": expElement,
        "TotalCost": expTotalCost,
        "Notes": expNotes
      }; // Data to send, if any

      var successCallback = function (response) {
        console.log("Success:", response);
        if(response.data['changedRows'] > 0){
          alert(response.data['affectedRows'] + " rows updated. " + response.message);  
        }
        else{
          alert(response.data['affectedRows'] + " new row added with ID: " + response.data['insertId']);
        }
        location.reload();
      };

      var errorCallback = function (error) {
        alert (error.toString());
      };

      makeAjaxRequest(url, method, data, successCallback, errorCallback); 
    }
    else {
      alert ("Error: Invalid expense details. Please correct any errors and try again.");
    }
  }
  else {
    alert ("Error: No changes found to save.");
  }
}

function deleteSingleItem() {
  var expid = element('expenseId').innerText;
  var id = parseInt(expid.split(".").pop());

  var url = "http://18.232.160.77:5000/api/" + id;
  var method = "DELETE";
  var data = null;
  

  var successCallback = function (response) {
    console.log("Success:", response);
    if(response.status == 200){
      alert(response.message);

      location.reload();
    }
    
  };

  makeAjaxRequest(url, method, data, successCallback, errorCallback);
  
}

function cancelChanges() {
  if(selectedRow == null){
    element('expenseId').innerHTML = "Expense No.";
    element('expenseCategory').value = "";
    element('expenseDescription').value = "";
    element('expenseDate').value = "";
    element('expenseCost').value = "";
    element('expenseIncludesHST').checked = false ;
    element('expenseTotalCost').value = "";
    element('expenseNotes').value = "";
  }
  else {
    element('expenseId').innerHTML = "Expense No. " + selectedRow.cells[0].textContent;
    element('expenseCategory').value = selectedRow.cells[1].textContent;
    element('expenseDescription').value = selectedRow.cells[2].textContent;
    element('expenseDate').value = selectedRow.cells[3].textContent;
    element('expenseCost').value = selectedRow.cells[4].textContent.substring(1);
    element('expenseIncludesHST').checked = selectedRow.cells[5].children[0].className == "bi bi-check2-square" ? true : false ;
    element('expenseTotalCost').value = selectedRow.cells[6].textContent.substring(1);
    element('expenseNotes').value = selectedRow.cells[7].textContent;

    readOnlySingleItem();
  }
  areThereChanges = false;
}

function ResetTableRows () {
  for(var rcnt = 0; rcnt < element('expenseTable').rows.length; rcnt++) {
    if (element('expenseTable').rows[rcnt].className != "") {
      var selectedRow = element('expenseTable').rows[rcnt];
      for(var cnt = 0; cnt < selectedRow.cells.length; cnt++) {
        selectedRow.cells[cnt].style.backgroundColor = 'white';
      }
    }
  }
}

//Adding all event handlers
element('expenseDescription').onkeyup = (el) => {
  if( el.srcElement.value == "") {
    isDescValid = false;
  }
  else{
    isDescValid = TextLength(el.srcElement.value, 'lblDescLength', 45);
    areThereChanges = true;
  }
}

element('expenseNotes').onkeyup = (el) => {
  isNotesValid = TextLength(el.srcElement.value, 'lblNotesLength', 150);
  areThereChanges = true;
}
