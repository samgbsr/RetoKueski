const url = 'http://localhost:3001'; // The URL of the back-end server

$(document).ready(async function () {
    const unreviewedTable = $('#unreviewed-table');
    const reviewedTable = $('#reviewed-table');

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const target = $(e.target).attr("href"); // activated tab
        if (target === '#unreviewed-tab') {
            UnreviewedTable(unreviewedTable);
        } else if (target === '#reviewed-tab') {
            ReviewedTable(reviewedTable);
        }
    });

    // Show the initial tab
    UnreviewedTable(unreviewedTable);
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

    const GetNotPendingPetitions = async () => {
        try {
            const response = await $.ajax({
                async: true
                , url: `${url}/dashboard/notPending`
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
                const {
                    PETITION_ID,
                    CLIENT_FULL_NAME,
                    ARCO_RIGHT,
                    CREATED_AT } = row;
                const formattedDate = new Date(CREATED_AT).toLocaleString();
                return { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, formattedDate };
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

    const ReviewedTable = async () => {
        try {
            const response = await GetNotPendingPetitions();
            const formattedData = response.map(row => {
                const {
                    PETITION_ID,
                    CLIENT_FULL_NAME,
                    ARCO_RIGHT,
                    CURRENT_STATUS,
                    CREATED_AT, UPDATED_AT } = row;
                const formattedDate1 = new Date(CREATED_AT).toLocaleString();
                const formattedDate2 = new Date(UPDATED_AT).toLocaleString();
                return { PETITION_ID, CLIENT_FULL_NAME, ARCO_RIGHT, CURRENT_STATUS, formattedDate1, formattedDate2 };
            });

            const table = $('#reviewed-table');
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


