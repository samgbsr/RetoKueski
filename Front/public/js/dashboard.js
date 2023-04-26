const url = 'http://localhost:3001'; // URL API

$(document).ready(async function () {

    UnreviewedTable();

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const target = $(e.target).attr("href");
        if (target === '#unreviewed-tab') {
            UnreviewedTable();
        } else if (target === '#reviewed-tab') {
            ReviewedTable();
        }
    });
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

const GetPetition = async (id) => {
    try {
        const response = await $.ajax({
            async: true
            , url: `${url}/petition/${id}`
            , type: 'GET'
            , dataType: 'json'
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const approvePetition = async (id) => {
    try {
        const response = await $.ajax({
            async: true
            , url: `${url}/petition/${id}/approve`
            , type: 'PUT'
            , dataType: 'json'
        });
        return response;
    } catch {
        console.error(error);
    }
}

const rejectPetition = async (id) => {
    try {
        const response = await $.ajax({
            async: true
            , url: `${url}/petition/${id}/reject`
            , type: 'PUT'
            , dataType: 'json'
        });
        return response;
    } catch {
        console.error(error);
    }
}

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

        tbody.empty();

        formattedData.forEach(row => {
            const tr = $('<tr>');
            Object.values(row).forEach(value => {
                const td = $('<td>').text(value);
                tr.append(td);
            });

            const button = document.createElement("button");
            button.className = "btn btn-primary";
            button.innerHTML = "Ver";
            button.onclick = async function () {
                try {
                    const response = await GetPetition(row.PETITION_ID);
                    sessionStorage.setItem("petition", JSON.stringify(response));
                    await showModal();
                } catch (error) {
                    console.error(error);
                }
            };

            const td = $('<td>').append(button);
            tr.append(td);
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

const showModal = async () => {
    try {
        const data = JSON.parse(sessionStorage.getItem("petition"));
        console.log(data);
        const modal = document.getElementById("InfoModal");
        const modalContent = modal.querySelector(".modal-content");
        const modalTitle = modalContent.querySelector(".modal-title");
        const modalBody = modalContent.querySelector(".modal-body");

        modalTitle.textContent = `Petición ${data[0].PETITION_ID}`;
        modalBody.innerHTML = `
      <p>Cliente: ${data[0].CLIENT_FULL_NAME}</p>
      <p>Derecho por ejercer: ${data[0].ARCO_RIGHT}</p>
      <p>Comentario: ${data[0].PETITION_COMMENT}</p>
    `;
    
        const aceptarBtn = modalContent.querySelector(".btn-success");
        aceptarBtn.addEventListener("click", () => {
            modal.style.display = "none";
            const toast = new bootstrap.Toast(document.getElementById("successToast"));
            toast.show();
        });

        const rechazarBtn = modalContent.querySelector(".btn-danger");
        rechazarBtn.addEventListener("click", () => {
            modal.style.display = "none";
            const toast = new bootstrap.Toast(document.getElementById("dangerToast"));
            toast.show();
        });

        modal.style.display = "block";
    } catch (error) {
        console.error(error);
    }
};


