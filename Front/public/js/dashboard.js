const { json } = require("express");

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

const UnreviewedTable = async () => {
    try {
        const response = await GetPendingPetitions();
        console.log(response);
        console.log(formattedData);
    } catch (error) {
        console.error(error);
    }
};
