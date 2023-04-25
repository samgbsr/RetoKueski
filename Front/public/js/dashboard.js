const url = 'http://localhost:3001'; // The URL of the back-end server

$(document).ready(async function () {
    sessionStorage.setItem("CLientId", 0);
    sessionStorage.setItem("TemporalDocumentId", 0);
    UnreviewedTable();
});

const GetPendingPetitions = async () => {
    try {
        const response = await $.ajax({
            async: true
            , url: `${url}/dashboard/pending`
            , type: 'GET'
            , dataType: 'json'
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

/*
const UnreviewedTable = async () => {
    try {
        const response = await GetPendingPetitions();
        console.log(response);
        const formattedData = response.map(row => {
            const { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, CREATED_AT } = row;
            return { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, CREATED_AT };
        });
        console.log(JSON.stringify(formattedData));
    } catch (error) {
        console.error(error);
    }
};
*/

const UnreviewedTable = async () => {
    try {
      const response = await GetPendingPetitions();
      const formattedData = response.map(row => {
        const { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, CREATED_AT } = row;
        return { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, CREATED_AT };
      });
  
      const table = $('#unreviewed-table');
      const tbody = table.find('tbody');
  
      // Remove existing rows
      tbody.empty();
  
      // Add new rows
      formattedData.forEach(row => {
        const tr = $('<tr>');
        Object.values(row).forEach(value => {
          const td = $('<td>').text(value);
          tr.append(td);
        });
        tbody.append(tr);
      });
    } catch (error) {
      console.error(error);
    }
  };